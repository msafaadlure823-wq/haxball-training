// ==UserScript==
// @name         HaxBall Avatar + Animation
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  HaxBall avatar changer with custom avatar animation
// @author       alpha + modifications
// @match        https://www.haxball.com/play
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/593231/HaxBall%20Avatar%20%2B%20Animation.user.js
// @updateURL https://update.greasyfork.org/scripts/593231/HaxBall%20Avatar%20%2B%20Animation.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ============================================================
    // CONFIGURAÇÕES
    // ============================================================

    // ---------------- DEFAULT AVATAR ----------------

    let defAvatar = "GK";

    // Voltar automaticamente ao avatar padrão depois de usar
    // uma tecla de avatar.
    let defAvatarActive = true;

    // Tempo até voltar ao avatar padrão.
    // 1000 = 1 segundo
    let defAvatarDelay = 500;

    let defAvatarMaxDelay = 3000;
    let defAvatarDelayIncreasement = 250;


    // ============================================================
    // ANIMAÇÃO
    // ============================================================

    // Tecla para iniciar/parar a animação.
    let animationKey1 = '+';
    let animationKey2 = '=';

    // Intervalo entre os frames, em milissegundos.
    //
    // 50  = muito rápido
    // 100 = rápido
    // 150 = bom para efeitos
    // 250 = mais lento
    let animationInterval = 140;

    // Avatar que será mostrado quando a animação for parada.
    let animationReturnToDefault = true;

    // ------------------------------------------------------------
    // FRAMES DA ANIMAÇÃO
    // ------------------------------------------------------------
    //
    // CADA ITEM ABAIXO É UM FRAME COMPLETO.
    //
    // Você pode usar 1 ou 2 caracteres em cada frame.
    //
    // Exemplo:
    //
    // "◥◤"
    // "◤◥"
    //
    // é um frame cada.
    //
    // Experimente substituir esta sequência pela sua própria.
    // ------------------------------------------------------------

    let animationFrames = [
  "◇◇", "▷◁"
    ];


    // ============================================================
    // TECLAS DOS MODOS
    // ============================================================

    // Ativar/desativar retorno ao avatar padrão
    let defAvatarActiveKey1 = '*';
    let defAvatarActiveKey2 = ']';

    // Alterar modo principal
    let changeMainMode1 = '}';
    let changeMainMode2 = '{';

    // Alterar slot de avatar
    let changeAvatarMode1 = ',';
    let changeAvatarMode2 = '[';

    // Alterar slot de texto
    let changeTextMode1 = 'º';
    let changeTextMode2 = 'ª';

    // Aumentar delay do avatar padrão
    let avatarReturnDelayIncreasement1 = '¹';
    let avatarReturnDelayIncreasement2 = '²';

    // Transformar o último avatar usado em avatar padrão
    let defaultAvatarChangeKey1 = '¬';
    let defaultAvatarChangeKey2 = '¢';


    // ============================================================
    // TECLAS DE AVATAR / TEXTO
    // ============================================================

    let key1_1 = 'x';
    let key1_2 = 'X';

    let key2_1 = 'z';
    let key2_2 = 'Z';

    let key3_1 = 'c';
    let key3_2 = 'C';

    let key4_1 = 'w';
    let key4_2 = 'W';

    let key5_1 = 'a';
    let key5_2 = 'A';

    let key6_1 = 's';
    let key6_2 = 'S';

    let key7_1 = 'd';
    let key7_2 = 'D';

    let key8_1 = 'v';
    let key8_2 = 'V';

    let key9_1 = 'f';
    let key9_2 = 'F';


    // ============================================================
    // AVATARES
    // ============================================================

    // a1 | a2 | a3 | a4

    let configAvatar1 = ['👊🏿', '😝', 'a', '🐐'];
    let configAvatar2 = ['🖕🏿', '😢', 'xD', '👑'];
    let configAvatar3 = ['🍆', '😍', 'EZ', '🔥'];
    let configAvatar4 = ['💩', '😎', ':D', '👆🏿'];
    let configAvatar5 = ['🤡', '🥳', ':)', '👈🏿'];
    let configAvatar6 = ['👋🏿', '🤬', ':x', '👇🏿'];
    let configAvatar7 = ['❄️', '🤣', ':B', '👉🏿'];
    let configAvatar8 = ['👶🏻', '🤫', ':c', '🤛🏿'];
    let configAvatar9 = ['👄', '😴', ':@', '🤜🏿'];


    // ============================================================
    // TEXTOS
    // ============================================================

    let configText1 = [
        "",
        "",
        "",
        ""
    ];

    let configText2 = [
        "Goooooooooooooooaaaalllll!!!",
        "",
        "",
        ""
    ];

    let configText3 = [
        "Pass!!!",
        "",
        "",
        ""
    ];

    let configText4 = [
        "Cmoonnn!!!",
        "",
        "",
        ""
    ];

    let configText5 = [
        "Nice Goal!!!",
        "",
        "",
        ""
    ];

    let configText6 = [
        "",
        "",
        "",
        ""
    ];

    let configText7 = [
        "",
        "",
        "",
        ""
    ];

    let configText8 = [
        "",
        "",
        "",
        ""
    ];

    let configText9 = [
        "",
        "",
        "",
        ""
    ];


    // ============================================================
    // DEBUG
    // ============================================================

    let debugModeActive = false;


    // ============================================================
    // ESTADO
    // ============================================================

    const modes = ['a', 't'];

    let mode = modes[0];

    const avatarModes = ["a1", "a2", "a3", "a4"];
    const textModes = ["t1", "t2", "t3", "t4"];

    let avatarMode = avatarModes[0];
    let textMode = textModes[0];

    let lastAvatar = defAvatar;

    let avatarPressed = 0;

    let animationRunning = false;
    let animationTimer = null;
    let animationIndex = 0;


    // ============================================================
    // ELEMENTOS DO HAXBALL
    // ============================================================

    let inputHax = null;
    let buttonHax = null;

    let frameObj = null;
    let frameWin = null;
    let frameDoc = null;


    // ============================================================
    // INTERFACE DE DEBUG
    // ============================================================

    let modeScreen = document.createElement('p');

    modeScreen.setAttribute(
        'style',
        `
        position: fixed;
        right: 10%;
        bottom: 0%;
        color: white;
        background-color: rgba(0,0,255,0.44);
        font-size: 1.3rem;
        z-index: 9999999;
        padding: 5px;
        margin: 0;
        `
    );

    document.body.prepend(modeScreen);


    // ============================================================
    // ENCONTRAR O JOGO
    // ============================================================

    function updateGameElements() {

        frameObj = document.querySelector('iframe.gameframe');

        if (frameObj) {

            frameWin = frameObj.contentWindow;

            try {
                frameDoc = frameWin.document;
            } catch (error) {
                console.log("Não foi possível acessar o iframe.");
                return;
            }

            inputHax = frameDoc.querySelector('.input input');
            buttonHax = frameDoc.querySelector('.input button');

        } else {

            frameWin = window;
            frameDoc = document;

            inputHax = document.querySelector('.input input');
            buttonHax = document.querySelector('.input button');
        }
    }


    updateGameElements();


    // Atualiza os elementos periodicamente.
    setInterval(updateGameElements, 1000);


    // ============================================================
    // UTILIDADES
    // ============================================================

    function isEmptyKey(key) {
        return key === '<<EMPTY>>' || key === '' || key == null;
    }


    function sleep(delay) {
        return new Promise(resolve => setTimeout(resolve, delay));
    }


    function chatize(key) {
        return '/avatar ' + key;
    }


    function displayMode() {

        let modeDisplay;

        if (mode === 'a') {
            modeDisplay = avatarMode;
        } else {
            modeDisplay = textMode;
        }

        modeScreen.innerHTML =
            'M: ' + modeDisplay +
            ' | Def Avt: ' + defAvatarActive +
            ' | Def Dly: ' + defAvatarDelay +
            ' | Def: ' + defAvatar +
            ' | ANIM: ' + (animationRunning ? 'ON' : 'OFF');
    }


    // ============================================================
    // REMOVER "AVATAR SET"
    // ============================================================

    function removeAvatarSet() {

        if (!frameDoc) {
            return;
        }

        try {

            const noticeList =
                frameDoc.querySelectorAll('div.log p.notice');

            for (let i = 0; i < noticeList.length; i++) {

                if (noticeList[i].innerText === 'Avatar set') {

                    noticeList[i].parentNode.removeChild(noticeList[i]);
                }
            }

        } catch (error) {
            // Ignora erros caso o HaxBall ainda esteja carregando.
        }
    }


    // ============================================================
    // TROCAR AVATAR
    // ============================================================

    function sendAvatar(key) {

        if (!inputHax || !buttonHax) {
            updateGameElements();
        }

        if (!inputHax || !buttonHax) {
            console.log("HaxBall ainda não está pronto.");
            return false;
        }

        inputHax.value = chatize(key);
        buttonHax.click();

        lastAvatar = key;

        removeAvatarSet();

        return true;
    }


    // ============================================================
    // TROCAR AVATAR NORMALMENTE
    // ============================================================

    function changeAvatar(key) {

        stopAnimation(false);

        if (sendAvatar(key)) {

            if (defAvatarActive) {
                returnDefAvatar();
            }
        }
    }


    // ============================================================
    // RETORNAR AO AVATAR PADRÃO
    // ============================================================

    async function returnDefAvatar() {

        avatarPressed++;

        await sleep(defAvatarDelay);

        avatarPressed--;

        if (avatarPressed === 0 && !animationRunning) {

            sendAvatar(defAvatar);

            removeAvatarSet();
        }
    }


    // ============================================================
    // ANIMAÇÃO
    // ============================================================

    function startAnimation() {

        if (animationRunning) {
            return;
        }

        if (!animationFrames || animationFrames.length === 0) {
            console.log("A animação não possui frames.");
            return;
        }

        animationRunning = true;
        animationIndex = 0;

        // Impede o sistema de avatar padrão de ficar interferindo.
        avatarPressed = 0;

        displayMode();

        runAnimationFrame();
    }


    function runAnimationFrame() {

        if (!animationRunning) {
            return;
        }

        if (animationFrames.length === 0) {
            stopAnimation(false);
            return;
        }

        const frame = animationFrames[animationIndex];

        sendAvatar(frame);

        animationIndex++;

        if (animationIndex >= animationFrames.length) {
            animationIndex = 0;
        }

        animationTimer = setTimeout(
            runAnimationFrame,
            animationInterval
        );
    }


    function stopAnimation(returnDefault = true) {

        if (!animationRunning) {
            return;
        }

        animationRunning = false;

        if (animationTimer !== null) {
            clearTimeout(animationTimer);
            animationTimer = null;
        }

        animationIndex = 0;

        displayMode();

        if (returnDefault && animationReturnToDefault) {
            sendAvatar(defAvatar);
        }
    }


    function toggleAnimation() {

        if (animationRunning) {
            stopAnimation(true);
        } else {
            startAnimation();
        }
    }


    // ============================================================
    // ALTERAR MODO
    // ============================================================

    function changeMainMode() {

        let modeIndex = modes.indexOf(mode);

        if (modeIndex < modes.length - 1) {
            mode = modes[modeIndex + 1];
        } else {
            mode = modes[0];
        }

        displayMode();
    }


    function changeAvatarMode() {

        let modeIndex = avatarModes.indexOf(avatarMode);

        if (modeIndex < avatarModes.length - 1) {
            avatarMode = avatarModes[modeIndex + 1];
        } else {
            avatarMode = avatarModes[0];
        }

        displayMode();
    }


    function changeTextMode() {

        let modeIndex = textModes.indexOf(textMode);

        if (modeIndex < textModes.length - 1) {
            textMode = textModes[modeIndex + 1];
        } else {
            textMode = textModes[0];
        }

        displayMode();
    }


    // ============================================================
    // EXECUTAR UMA TECLA
    // ============================================================

    function press(key) {

        // --------------------------------------------------------
        // ANIMAÇÃO
        // --------------------------------------------------------

        if (
            key === animationKey1 ||
            key === animationKey2
        ) {

            toggleAnimation();
            return;
        }


        // --------------------------------------------------------
        // DEFINIR AVATAR PADRÃO
        // --------------------------------------------------------

        if (
            key === defaultAvatarChangeKey1 ||
            key === defaultAvatarChangeKey2
        ) {

            defAvatar = lastAvatar;

            displayMode();

            return;
        }


        // --------------------------------------------------------
        // AUMENTAR DELAY DO AVATAR PADRÃO
        // --------------------------------------------------------

        if (
            key === avatarReturnDelayIncreasement1 ||
            key === avatarReturnDelayIncreasement2
        ) {

            defAvatarDelay += defAvatarDelayIncreasement;

            if (defAvatarDelay > defAvatarMaxDelay) {
                defAvatarDelay = 250;
            }

            displayMode();

            return;
        }


        // --------------------------------------------------------
        // ATIVAR/DESATIVAR AVATAR PADRÃO
        // --------------------------------------------------------

        if (
            key === defAvatarActiveKey1 ||
            key === defAvatarActiveKey2
        ) {

            defAvatarActive = !defAvatarActive;

            displayMode();

            return;
        }


        // --------------------------------------------------------
        // TROCAR MODO PRINCIPAL
        // --------------------------------------------------------

        if (
            key === changeMainMode1 ||
            key === changeMainMode2
        ) {

            changeMainMode();

            return;
        }


        // --------------------------------------------------------
        // TROCAR SLOT DE AVATAR
        // --------------------------------------------------------

        if (
            key === changeAvatarMode1 ||
            key === changeAvatarMode2
        ) {

            changeAvatarMode();

            return;
        }


        // --------------------------------------------------------
        // TROCAR SLOT DE TEXTO
        // --------------------------------------------------------

        if (
            key === changeTextMode1 ||
            key === changeTextMode2
        ) {

            changeTextMode();

            return;
        }


        // ========================================================
        // MODO AVATAR
        // ========================================================

        if (mode === 'a') {

            switch (key) {

                case key1_1:
                case key1_2:
                    changeAvatar(
                        configAvatar1[
                            avatarModes.indexOf(avatarMode)
                        ]
                    );
                    return;

                case key2_1:
                case key2_2:
                    changeAvatar(
                        configAvatar2[
                            avatarModes.indexOf(avatarMode)
                        ]
                    );
                    return;

                case key3_1:
                case key3_2:
                    changeAvatar(
                        configAvatar3[
                            avatarModes.indexOf(avatarMode)
                        ]
                    );
                    return;

                case key4_1:
                case key4_2:
                    changeAvatar(
                        configAvatar4[
                            avatarModes.indexOf(avatarMode)
                        ]
                    );
                    return;

                case key5_1:
                case key5_2:
                    changeAvatar(
                        configAvatar5[
                            avatarModes.indexOf(avatarMode)
                        ]
                    );
                    return;

                case key6_1:
                case key6_2:
                    changeAvatar(
                        configAvatar6[
                            avatarModes.indexOf(avatarMode)
                        ]
                    );
                    return;

                case key7_1:
                case key7_2:
                    changeAvatar(
                        configAvatar7[
                            avatarModes.indexOf(avatarMode)
                        ]
                    );
                    return;

                case key8_1:
                case key8_2:
                    changeAvatar(
                        configAvatar8[
                            avatarModes.indexOf(avatarMode)
                        ]
                    );
                    return;

                case key9_1:
                case key9_2:
                    changeAvatar(
                        configAvatar9[
                            avatarModes.indexOf(avatarMode)
                        ]
                    );
                    return;
            }
        }


        // ========================================================
        // MODO TEXTO
        // ========================================================

        if (mode === 't') {

            let text = null;

            switch (key) {

                case key1_1:
                case key1_2:
                    text = configText1[
                        textModes.indexOf(textMode)
                    ];
                    break;

                case key2_1:
                case key2_2:
                    text = configText2[
                        textModes.indexOf(textMode)
                    ];
                    break;

                case key3_1:
                case key3_2:
                    text = configText3[
                        textModes.indexOf(textMode)
                    ];
                    break;

                case key4_1:
                case key4_2:
                    text = configText4[
                        textModes.indexOf(textMode)
                    ];
       
