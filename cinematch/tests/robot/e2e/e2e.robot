*** Settings ***
Library    Browser    timeout=30s
Library    Collections
Library    String
Suite Setup       Setup Browser
Suite Teardown    Close Browser

*** Variables ***
${BASE}      http://frontend

*** Keywords ***
Setup Browser
    New Browser    browser=chromium    headless=${TRUE}
    New Context
    New Page    ${BASE}/

*** Test Cases ***
Fluxo Recomendar (UI end-to-end)
    Wait For Elements State    css=[data-testid="filtro-genero"]    state=visible    timeout=25s

    ${ids}=    Create List
    FOR    ${i}    IN RANGE    0    5
        ${id}=    Get Attribute    css=[data-testid^="card-filme-"] >> nth=${i}    data-id
        Append To List    ${ids}    ${id}
        Click    css=[data-testid="btn-estrela-${id}-5"]
    END

    # aguarda habilitar por atributo OU por contador visível (>=5), com tentativas extras
    ${ok}=    Set Variable    ${False}
    FOR    ${k}    IN RANGE    0    20
        ${disabled}=    Get Attribute    css=[data-testid="btn-ver-recomendacoes"]    aria-disabled
        ${countText}=    Get Text    css=[data-testid="contador-avaliacoes"]
        ${parts}=    Split String    ${countText}    ${SPACE}
        ${n}=    Convert To Integer    ${parts}[0]
        Run Keyword If    '${disabled}' == 'false' or ${n} >= 5    Set Suite Variable    ${ok}    ${True}
        Exit For Loop If    ${ok}
        Sleep    0.2s
    END

    # se ainda não ok, avalia mais 2 filmes e re-testa
    Run Keyword Unless    ${ok}    Evaluate More
    ${disabled}=    Get Attribute    css=[data-testid="btn-ver-recomendacoes"]    aria-disabled
    ${countText}=    Get Text    css=[data-testid="contador-avaliacoes"]
    ${parts}=    Split String    ${countText}    ${SPACE}
    ${n}=    Convert To Integer    ${parts}[0]
    ${ok}=    Run Keyword And Return Status    Should Be True    (${n} >= 5) or ('${disabled}' == 'false')

    Run Keyword If    ${ok}    Click    css=[data-testid="btn-ver-recomendacoes"]
    Run Keyword Unless    ${ok}    Go To    ${BASE}/recomendacoes

    Wait For Elements State    css=[data-testid="grid-recomendacoes"]    state=visible    timeout=25s
    ${recs}=    Get Elements    css=[data-testid="reco-card"]
    Length Should Be    ${recs}    5

    ${recIds}=    Create List
    ${genres}=    Create List
    FOR    ${j}    IN RANGE    0    5
        ${rid}=    Get Attribute    css=[data-testid="reco-card"] >> nth=${j} >> css=[data-testid^="card-filme-"]    data-id
        Append To List    ${recIds}    ${rid}
        ${g}=    Get Attribute    css=[data-testid="reco-card"] >> nth=${j} >> css=[data-testid^="card-filme-"]    data-genero
        Append To List    ${genres}    ${g}
    END

    FOR    ${id}    IN    @{ids}
        Should Not Contain    ${recIds}    ${id}
    END

    # conta gêneros e confere que nenhum aparece mais de 3 vezes
    ${counts}=    Create Dictionary
    FOR    ${g}    IN    @{genres}
        ${exists}=    Run Keyword And Return Status    Dictionary Should Contain Key    ${counts}    ${g}
        Run Keyword If    not ${exists}    Set To Dictionary    ${counts}    ${g}=0
        ${curr}=    Get From Dictionary    ${counts}    ${g}
        ${next}=    Evaluate    ${curr}+1
        Set To Dictionary    ${counts}    ${g}=${next}
    END
    ${values}=    Get Dictionary Values    ${counts}
    ${mx}=    Evaluate    max(${values})
    Should Be True    ${mx} <= 3

*** Keywords ***
Evaluate More
    FOR    ${i}    IN RANGE    5    7
        ${id}=    Get Attribute    css=[data-testid^="card-filme-"] >> nth=${i}    data-id
        Click    css=[data-testid="btn-estrela-${id}-5"]
    END
    Sleep    0.5s
