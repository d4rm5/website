---
title: "Navegar en internet y no ser trackeado en el intento 🕵🏻"
description: "Navegar en internet y no ser atacado por infinitos trackers es algo cada día más dificil. En este artículo voy a recopilar algunas de las herramientas disponibles (en desktop) para combatir esos mald…"
pubDate: 2022-05-25
legacyId: "QTXMo2YlHvEvpLMF7mFh"
---

Navegar en internet y no ser atacado por infinitos trackers es algo cada día más dificil. En este artículo voy a recopilar algunas de las herramientas disponibles (en desktop) para combatir esos malditos bloques de código que nos siguen por donde sea que vamos.

> Foto de Lianhao Qu | [↗ lianhao @ Unsplash](https://unsplash.com/@lianhao)

## Navegador

Elegir un buen navegador es de las cosas más importantes para mejorar nuestra privacidad online. En este sentido creo que existen dos grandes grupos de navegadores entre los que elegir: las skins de Google Chrome y los navegadores "independientes".

En el primer grupo se encuentran Google Chrome, Opera (y Opera GX), Brave, Microsoft Edge y millones más. Mientras que en el segundo grupo tenemos a Firefox y Tor (basado en Firefox).

¿Cuáles son las principales diferencias? El primer grupo es el que eligen la mayoría de usuarios, y por lo tanto es el que nos brinda una mayor cantidad de extensiones compatibles. También existen sitios que parecen ser diseñados exclusivamente para estos navegadores, ya que en la competencia funcionan con un rendimiento menor o llegando a ser practicamente inutilizables. El segundo grupo nos brinda alternativas open source desarrolladas por organizaciones non-profit lo que nos garantiza que están enfocados en el usuario y no en las ganancias de una empresa. Dentro de lo técnico encontramos una diferencia en los _render engines_ sobre los que están construidos estos navegadores, siendo que el primer grupo utiliza Blink (creado por Google) y el segundo utiliza Gecko (creado por Mozilla). En la actualidad Blink tiene cerca del 85% del market share y esto deja prácticamente monopolizado el sector en manos de Google. Debido a esto último yo elijo utilizar Firefox, aunque claramente ustedes son libres de usar el que más les guste.

> [↗ Global Desktop Browser Market Share 2022 @ Kinsta](https://kinsta.com/browser-market-share/) [↗ Why every browser switching to Blink could be bad news for the web @ Medium](https://medium.com/@stouff.nicolas/why-every-browser-switching-to-blink-could-be-bad-news-for-the-web-aea773059e84)

### Edit: Manifest V3

Me olvidé de mencionar un tema importante, Manifest V3 es un nuevo standard de extensiones creado por Google, que bajo la **excusa** de mejorar privacidad, seguridad y performance, nerfea una gran cantidad de extensiones, entre ellas ad blockers. Mozilla ya adelantó que van a seguir soportando la V2 en Firefox a pesar de incluir esta V3, por lo que los necesarios ad blockers van a seguir funcionando. Otro punto a favor para el panda rojo [(si, Firefox es un panda y no un zorro).](https://en.wikipedia.org/wiki/Red_panda)

> [↗ Manifest V3 in Firefox: Recap & Next Steps @ Mozilla Blog](https://blog.mozilla.org/addons/2022/05/18/manifest-v3-in-firefox-recap-next-steps/) [↗ Google’s Manifest V3 Still Hurts Privacy, Security, and Innovation @ EFF](https://www.eff.org/deeplinks/2021/12/googles-manifest-v3-still-hurts-privacy-security-innovation)

## Extensiones

Voy a recopilar las extensiones que creo necesarias para navegar la web en condiciones:

### uBlock Origin

Este es EL MEJOR bloqueador de publicidad que existe, es compatible con Firefox e infinitos navegadores, al ser open source es verificable que no realicen negocios a costa de sus usuarios como ha sucedido en el pasado con otras (por no decir la mayoría) alternativas.

> [↗ uBlock Origin @ Github](https://github.com/gorhill/uBlock#readme) [↗ Google pay Adblock Plus to show you ads anyway @ Techcrunch](https://techcrunch.com/2013/07/06/google-and-others-reportedly-pay-adblock-plus-to-show-you-ads-anyway/)

### HTTPS Everywhere

Esta extensión ya no tiene mucho sentido, porque HTTPS ya está en todos lados, en consecuencia dejo linkeado el artículo de EFF donde explican como activar esto en todos los navegadores.

> [↗ HTTPS Is Actually Everywhere @ EFF](https://www.eff.org/deeplinks/2021/09/https-actually-everywhere)

### Decentraleyes

Esta extensión impide que seas trackeado.

> [↗ Decentraleyes @ decentraleyes.org](https://decentraleyes.org/)

### Cookie AutoDelete + I don't care about cookies

Este combo demoledor de cookies es realmente opcional, la primera extensión va a hacer que se eliminen las cookies al cerrar una pestaña y la segunda que no aparezcan los carteles consultando si queremos aceptar o denegar las cookies de los sitios.

> [↗ Cookie AutoDelete @ Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/cookie-autodelete/) [↗ Cookie AutoDelete @ Chrome Web Store](https://chrome.google.com/webstore/detail/cookie-autodelete/fhcgjolkccmbidfldomjliifgaodjagh) [↗ I don't care about cookies @ Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/i-dont-care-about-cookies/) [↗ I don't care about cookies @ Chrome Web Store](https://chrome.google.com/webstore/detail/i-dont-care-about-cookies/fihnjjcciajhdojfnbdddfaoknhalnja)

### ClearURLs

Esta extensión elimina los trackers que se inyectan cuando compartimos una URL.

> [↗ ClearURLs @ GitLab](https://gitlab.com/KevinRoebert/ClearUrls/-/blob/master/README.md)

### xBrowserSync

Esta extensión no es 100% necesaria, pero es muy útil si usamos varios navegadores ya que nos permite sincronizar nuestros marcadores sin registrarnos en ningún servicio, solo eligiendo un password.

> [↗ xBrowserSync @ xbrowsersync.org](https://www.xbrowsersync.org/)
