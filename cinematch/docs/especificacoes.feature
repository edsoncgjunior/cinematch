Feature: Recomendações do CineMatch

  Background:
    Given que o usuário acessa o catálogo
    And limpa avaliações anteriores

  Scenario: Botão "Ver Recomendações" só habilita após 5 avaliações
    When o usuário avalia 5 filmes com 5 estrelas
    Then o botão de ver recomendações fica habilitado

  Scenario: Geração de 5 recomendações respeitando RN003
    Given que o usuário avaliou ao menos 5 filmes
    When solicita recomendações
    Then exatamente 5 filmes são exibidos
    And nenhum filme recomendado foi avaliado
    And há no máximo 3 filmes do mesmo gênero

  Scenario: Cenário 1 do enunciado
    Given as avaliações exatamente como no enunciado (cenario 1)
    When solicita recomendações
    Then a ordem esperada é:
      | Interestelar | Gladiador | Duro de Matar | A Chegada | Os Vingadores |

  Scenario: Cenário 2 do enunciado
    Given as avaliações exatamente como no enunciado (cenario 2)
    When solicita recomendações
    Then a ordem esperada é:
      | A Origem | Matrix | Interestelar | Um Sonho de Liberdade | Parasita |
