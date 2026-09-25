// HaxBall Mobile Auto-Follow Script
(function() {
    let autoFollowActive = false;

    // الاستماع لضغط زر الشوت / لمس الشاشة
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.key === 'x') autoFollowActive = true;
    });
    window.addEventListener('keyup', (e) => {
        if (e.code === 'Space' || e.key === 'x') autoFollowActive = false;
    });

    // التوجيه التلقائي ونقل اللاعب باتجاه الكرة
    function update() {
        if (autoFollowActive && window.room && window.room.getPlayerList) {
            const players = room.getPlayerList();
            const me = players.find(p => p.id === room.getMe()?.id);
            const ball = room.getBallPosition();

            if (me && me.position && ball) {
                const dx = ball.x - me.position.x;
                const dy = ball.y - me.position.y;
                
                let inputs = 0;
                if (dx > 5) inputs |= 2;  // Right
                if (dx < -5) inputs |= 1; // Left
                if (dy > 5) inputs |= 8;  // Down
                if (dy < -5) inputs |= 4; // Up

                room.setPlayerInputKeys(inputs);
            }
        }
        requestAnimationFrame(update);
    }

    update();
})();
