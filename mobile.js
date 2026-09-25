// HaxBall Mobile Visible Touch Auto-Follow Script
(function() {
    let autoFollowActive = false;

    // إنشاء زر لمس طافي على الشاشة
    const btn = document.createElement('button');
    btn.innerText = 'تتبع تلقائي';
    btn.style.position = 'fixed';
    btn.style.bottom = '20px';
    btn.style.right = '20px';
    btn.style.zIndex = '9999';
    btn.style.padding = '15px 25px';
    btn.style.backgroundColor = 'rgba(0, 150, 255, 0.8)';
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.borderRadius = '50px';
    btn.style.fontSize = '16px';
    btn.style.fontWeight = 'bold';
    btn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';

    document.body.appendChild(btn);

    // تفعيل التتبع عند الضغط/اللمس المستمر على الزر
    btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        autoFollowActive = true;
        btn.style.backgroundColor = 'rgba(0, 230, 118, 0.9)';
    });

    btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        autoFollowActive = false;
        btn.style.backgroundColor = 'rgba(0, 150, 255, 0.8)';
    });

    // تحديث حركة اللاعب باتجاه الكرة
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
