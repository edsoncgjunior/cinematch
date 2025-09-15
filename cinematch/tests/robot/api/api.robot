*** Settings ***
Library    Collections
Library    RequestsLibrary

*** Variables ***
${API}     http://backend:3000/api

*** Test Cases ***
API - Health e filmes
    Create Session    api    ${API}
    ${res}=    GET On Session    api    /health
    Should Be Equal As Integers    ${res.status_code}    200
    ${r}=    GET On Session    api    /filmes
    Should Be Equal As Integers    ${r.status_code}    200
    Dictionary Should Contain Key    ${r.json()}    filmes
