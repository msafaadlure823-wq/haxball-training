// HaxBall Mobile Enhanced Auto-Follow & Ball Predictor
(function() {
    let isKicking = false;
    let canvas = document.querySelector('canvas');

    // استجابة لمس فائقة السرعة بدون تأخير
    window.addEventListener('touchstart', (e) => {
        for (let i = 0; i < e.touches.length; i++) {
            if (e.touches[i].clientX > window.innerWidth / 2) {
                isKicking = true;
            }
        }
    }, { passive: true, capture: true });

    window.addEventListener('touchend', (e) => {
        let rightTouch = false;
        for (let i = 0; i < e.touches.length; i++) {
            if (e.touches[i].clientX > window.innerWidth / 2) {
                rightTouch = true;
            }
        }
        if (!rightTouch) isKicking = false;
    }, { passive: true, capture: true });

    // رسم مسار ومكان اتجاه الكرة المستقبلي على الشاشة
    function drawBallPrediction(ctx, ball) {
        if (!ball || !ball.x || !ball.y) return;

        // توقع مكان الكرة المستقبلي بناءً على سرعتها (Ball Velocity)
        const futureX = ball.x + (ball.vx || 0) * 10;
        const futureY = ball.y + (ball.vy || 0) * 10;

        ctx.save();
        ctx.beginPath();
        ctx.setLineDash([5, 5]);
        ctx.moveTo(ball.x, ball.y);
        ctx.lineTo(futureX, futureY);
        ctx.strokeStyle = 'rgba(255, 235, 59, 0.8)'; // خط أصفر منقط
        ctx.lineWidth = 3;
        ctx.stroke();

        // دائرة استهداف مكان وصول الكرة
        ctx.beginPath();
        ctx.arc(futureX, futureY, 8, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(255, 87, 34, 0.7)'; // نقطة برتقالية
        ctx.fill();
        ctx.restore();
    }

    // حلقة التحكم والتوجيه الفوري
    function gameLoop() {
        if (window.room && window.room.getPlayerList) {
            const players = room.getPlayerList();
            const me = players.find(p => p.id === room.getMe()?.id);
            const ball = room.getBallPosition();

            // عند الضغط المستمر على زر الشوت
            if (isKicking && me && me.position && ball) {
                // توقع موقع الكرة الفعلي مع السرعة لزيادة دقة الملاحقة
                const targetX = ball.x + (ball.vx || 0) * 2;
                const targetY = ball.y + (ball.vy || 0) * 2;

                const dx = targetX - me.position.x;
                const dy = targetY - me.position.y;
                
                let inputs = 0;
                // توجيه دقيق وسريع
                if (dx > 2) inputs |= 2;   // Right
                if (dx < -2) inputs |= 1;  // Left
                if (dy > 2) inputs |= 8;   // Down
                if (dy < -2) inputs |= 4;  // Up
                
                inputs |= 16; // Kick (تفعيل الشوت مع الملاحقة)

                room.setPlayerInputKeys(inputs);
            }
        }
        requestAnimationFrame(gameLoop);
    }

    gameLoop();
})();
 
