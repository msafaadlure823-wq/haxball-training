// HaxBall Mobile Touch Auto-Follow Script
(function() {
    let autoFollowActive = false;

    // تفعيل التتبع عند لمس الشاشة
    window.addEventListener('touchstart', (e) => {
        if (e.touches[0].clientX > window.innerWidth / 2) {
            autoFollowActive = true;
        }
    });

    window.addEventListener('touchend', () => {
        autoFollowActive = false;
    });

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
