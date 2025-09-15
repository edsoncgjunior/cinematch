*** Settings ***
Library    RequestsLibrary

*** Variables ***
${API}    http://backend:3000/api
${USUARIO}    robot_api

*** Test Cases ***
Health Deve Responder
    Create Session    api    ${API}
    ${r}=    Get Request    api    /health
    Should Be Equal As Integers    ${r.status_code}    200
    Dictionary Should Contain Key   ${r.json()}   status

Listar Filmes 200
    ${r}=    Get Request    api    /filmes
    Should Be Equal As Integers    ${r.status_code}    200
    Dictionary Should Contain Key   ${r.json()}   filmes

Fluxo API - Avaliar e Recomendar
    # Limpa avaliações do usuário
    ${r}=    Delete Request    api    /avaliacoes    params=usuarioId=${USUARIO}
    # Avalia 5 filmes (1..5) com estrelas 5
    :FOR    ${id}    IN RANGE    1    6
    \    ${body}=    Create Dictionary    usuarioId=${USUARIO}    filmeId=${id}    estrelas=5
    \    ${r}=    Post Request    api    /avaliacoes    json=${body}
    \    Should Be Equal As Integers    ${r.status_code}    201

    # Pede recomendações
    ${r}=    Get Request    api    /recomendacoes    params=usuarioId=${USUARIO}
    Should Be Equal As Integers    ${r.status_code}    200
    ${lista}=    Set Variable    ${r.json()['recomendacoes']}
    Should Be True    len(${lista}) >= 1
    # Verifica que nenhum recomendado está entre os avaliados (1..5)
    :FOR    ${item}    IN    @{lista}
    \    ${id}=    Get From Dictionary    ${item}    id
    \    Should Not Contain    ${[1,2,3,4,5]}    ${id}