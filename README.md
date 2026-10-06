# Detox — estado e ciclo de vida no React Native

[English version](README.en.md)

Testes gray-box sobre o exemplo React Native oficial do [Wix Detox 20.51.4](https://github.com/wix/Detox/tree/02f32837c74e19b7410b10976d360e1d6571f435/examples/demo-react-native). O app é obtido da fonte fixada no `.env`; sua lógica não é reimplementada neste repositório. O objetivo é distinguir atualização de estado, retomada e reinício, com a sincronização do Detox habilitada.

## O que é verificado

Três escolhas produzem mensagens diferentes e removem os controles iniciais. Mais dois testes verificam que a saudação sobrevive ao background, mas é reiniciada quando o processo termina; depois do reinício uma nova escolha precisa funcionar. Cada caso começa com uma nova instância.

É um exemplo pequeno de estado em memória, não um sistema de checkout ou validação de backend. Não usa sleeps, desativações globais da sincronização ou retries para esconder flakiness.

## Execução Android

Node 24, Java 17, Python 3.13 para o summary, Android SDK e emulador API 35. Build no Linux; o workflow fornece o ambiente.

```bash
cp .env.example .env
npm ci
npm run prepare:app
npm run build:android
npm run test:android
```

Configure `ANDROID_DEVICE` conforme `adb devices`. O prepare obtém um commit exato, copia o exemplo para `.app`, usa o lockfile deste repo e adapta caminhos do monorepo/instrumentação. Não altera `app.js` nem os resultados esperados da aplicação. A configuração usa um build release com JS empacotado, sem Metro em paralelo.

`e2e/pages` concentra interações e asserções reutilizadas. `e2e/lifecycle.test.js` contém os cinco casos. `.app`, `.upstream`, APKs e resultados não são versionados. Para refazer a preparação, use checkout limpo ou examine esses diretórios antes de removê-los.

## CI e limites

[Actions](https://github.com/brunobaccari/detox-react-native-lifecycle/actions) compila o app e a instrumentação antes do emulador. O summary mostra cada caso; o artifact `android-results` contém JUnit e os diagnósticos disponíveis do Detox por 14 dias. Cinco casos executados e aprovados são obrigatórios; relatório vazio, falha ou skip reprova.

Nenhuma integração de produção, persistência durável ou cobertura iOS foi validada. O próprio aplicativo de exemplo é propositalmente limitado; o portfólio demonstra o mecanismo e a distinção entre estados do ciclo de vida. Dependências de build de terceiros têm ciclo de atualização separado.
