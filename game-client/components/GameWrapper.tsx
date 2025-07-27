import React, { useEffect, useRef, useState } from 'react';

interface GameWrapperProps {
  onGameEnd: (score: number, accuracy: number) => void;
  onPause: () => void;
  onWinnerAchieved?: (score: number, accuracy: number) => void;
  currentLevel: number;
}

export default function GameWrapper({ onGameEnd, onPause, onWinnerAchieved, currentLevel }: GameWrapperProps) {
  const gameRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  useEffect(() => {
    if (typeof window !== 'undefined' && gameRef.current) {
      let gameInstance: any = null;
      
      import('phaser').then((Phaser) => {
        // Get container dimensions
        const container = gameRef.current;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;

        const config = {
          type: Phaser.AUTO,
          parent: gameRef.current,
          width: containerWidth,
          height: containerHeight,
          backgroundColor: '#000011',
          physics: {
            default: 'arcade',
            arcade: {
              gravity: { x: 0, y: 200 },
              debug: false
            }
          },
          scene: {
            preload: preload,
            create: create,
            update: update
          }
        };

        gameInstance = new Phaser.Game(config);
        
        // Add error handling
        gameInstance.events.on('error', (error: any) => {
          console.error('Phaser game error:', error);
        });

        // Handle window resize
        const handleResize = () => {
          if (gameRef.current && gameInstance && !gameInstance.destroyed) {
            const newWidth = gameRef.current.clientWidth;
            const newHeight = gameRef.current.clientHeight;
            gameInstance.scale.resize(newWidth, newHeight);
          }
        };

        window.addEventListener('resize', handleResize);
        let player: any;
        let stars: any;
        let cursors: any;
        let scoreText: any;
        let timeText: any;
        let gameTime = 0;
        let shotsFired = 0;
        let shotsHit = 0;
        let starSpawnTimer = 0;
        let levelTime = 0;
        let progressBar: any;
        let currentScore = 0;
        let winnerAchieved = false;
        let winnerText: any = null;

        function preload(this: any) {
          // Load custom game assets
          this.load.image('rocket', '/Rocket.png');
          this.load.image('star', '/Stsr.png');
          
          // Add loading event listeners for debugging
          this.load.on('complete', () => {
            console.log('All assets loaded successfully');
          });
          
          this.load.on('loaderror', (file: any) => {
            console.error('Failed to load asset:', file.src);
          });
        }

        function createSpaceBackground(scene: any) {
          // Create deep space gradient
          const gradient = scene.add.graphics();
          gradient.fillGradientStyle(0x000011, 0x000011, 0x000033, 0x000033, 1);
          gradient.fillRect(0, 0, scene.game.config.width, scene.game.config.height);
          
          // Add nebula effects
          const nebula1 = scene.add.graphics();
          nebula1.fillStyle(0x330066, 0.3);
          nebula1.fillEllipse(scene.game.config.width * 0.2, scene.game.config.height * 0.3, 200, 100);
          
          const nebula2 = scene.add.graphics();
          nebula2.fillStyle(0x660033, 0.2);
          nebula2.fillEllipse(scene.game.config.width * 0.8, scene.game.config.height * 0.7, 150, 80);
          
          const nebula3 = scene.add.graphics();
          nebula3.fillStyle(0x003366, 0.25);
          nebula3.fillEllipse(scene.game.config.width * 0.5, scene.game.config.height * 0.2, 180, 90);
          
          // Add background stars (static)
          for (let i = 0; i < 150; i++) {
            const x = Phaser.Math.Between(0, scene.game.config.width);
            const y = Phaser.Math.Between(0, scene.game.config.height);
            const size = Phaser.Math.FloatBetween(0.5, 2);
            const brightness = Phaser.Math.FloatBetween(0.3, 1);
            
            const star = scene.add.circle(x, y, size, 0xffffff, brightness);
            star.setDepth(1);
            
            // Add twinkling animation
            scene.tweens.add({
              targets: star,
              alpha: brightness * 0.5,
              duration: Phaser.Math.Between(1000, 3000),
              yoyo: true,
              repeat: -1,
              delay: Phaser.Math.Between(0, 2000)
            });
          }
          
          // Add shooting stars occasionally
          scene.time.addEvent({
            delay: 5000,
            callback: () => {
              const shootingStar = scene.add.graphics();
              shootingStar.lineStyle(2, 0xffffff, 0.8);
              shootingStar.lineBetween(0, 0, 100, 20);
              shootingStar.setPosition(
                Phaser.Math.Between(0, scene.game.config.width),
                Phaser.Math.Between(0, scene.game.config.height * 0.5)
              );
              shootingStar.setDepth(2);
              
              scene.tweens.add({
                targets: shootingStar,
                x: shootingStar.x + 200,
                y: shootingStar.y + 40,
                alpha: 0,
                duration: 1000,
                onComplete: () => shootingStar.destroy()
              });
            },
            loop: true
          });
        }

        function spawnStar(scene: any) {
          const x = Phaser.Math.Between(50, scene.game.config.width - 50);
          const star = scene.add.image(x, -20, 'star');
          star.setScale(0.08); // Much smaller stars for better gameplay
          
          // Debug: Check if star image loaded properly
          if (!star.texture.key || star.texture.key === '__MISSING') {
            console.error('Star image not loaded properly, falling back to circle');
            star.destroy();
            const fallbackStar = scene.add.circle(x, -20, 16, 0xffff00);
            scene.physics.add.existing(fallbackStar);
            fallbackStar.body.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            fallbackStar.body.setVelocityX(Phaser.Math.Between(-60, 60));
            fallbackStar.body.setVelocityY(Phaser.Math.Between(50, 150));
            stars.add(fallbackStar);
            
            scene.time.delayedCall(10000, () => {
              if (fallbackStar.active) {
                fallbackStar.destroy();
              }
            });
            return;
          }
          
          scene.physics.add.existing(star);
          star.body.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
          star.body.setVelocityX(Phaser.Math.Between(-60, 60));
          star.body.setVelocityY(Phaser.Math.Between(50, 150));
          stars.add(star);
          
          // Remove star when it goes off screen
          scene.time.delayedCall(10000, () => {
            if (star.active) {
              star.destroy();
            }
          });
        }

        function create(this: any) {
          // Check if game is properly initialized
          if (!this.game || this.game.destroyed) {
            console.error('Game not properly initialized');
            return;
          }
          
          // Reset timers for new level
          gameTime = 0;
          levelTime = 0;
          starSpawnTimer = 0;
          
          // Reset winner state for new level
          winnerAchieved = false;
          
          // Clear any existing winner text from previous level
          if (winnerText) {
            winnerText.destroy();
            winnerText = null;
          }
          
          // Create space background
          createSpaceBackground(this);
          
          // Create stars group
          stars = this.physics.add.group();
          
          // Add initial stars (fewer to start)
          for (let i = 0; i < 6; i++) {
            spawnStar(this);
          }

          // Create player (rocket) - positioned at bottom center
          player = this.add.image(this.game.config.width / 2, this.game.config.height - 30, 'rocket');
          player.setScale(0.15); // Much smaller rocket for better gameplay
          
          // Debug: Check if rocket image loaded properly
          if (!player.texture.key || player.texture.key === '__MISSING') {
            console.error('Rocket image not loaded properly, falling back to circle');
            player.destroy();
            player = this.add.circle(this.game.config.width / 2, this.game.config.height - 30, 30, 0x00ff00);
            player.setStrokeStyle(4, 0xffffff);
            player.setFillStyle(0x00ff00, 1);
          }
          
          this.physics.add.existing(player);
          player.body.setCollideWorldBounds(true);
          
          // Ensure player is always on top
          player.setDepth(1000);
          
          // Add background highlight for player
          const playerHighlight = this.add.circle(this.game.config.width / 2, this.game.config.height - 30, 35, 0xffffff, 0.2);
          playerHighlight.setDepth(999);
          
          console.log('Player created at:', this.game.config.width / 2, this.game.config.height - 30);
          
          // Add player label
          const playerLabel = this.add.text(this.game.config.width / 2, this.game.config.height - 10, '🚀 ROCKET', { 
            fontSize: '16px', 
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
          });
          playerLabel.setOrigin(0.5, 0);
          playerLabel.setDepth(1001);
          
          // Add firing direction indicator
          const firingIndicator = this.add.graphics();
          firingIndicator.lineStyle(3, 0xffffff, 0.8);
          firingIndicator.lineBetween(
            this.game.config.width / 2, 
            this.game.config.height - 30, 
            this.game.config.width / 2, 
            this.game.config.height - 80
          );
          firingIndicator.setDepth(998);
          
          // Add game area boundary indicator (for debugging)
          const boundaryIndicator = this.add.graphics();
          boundaryIndicator.lineStyle(2, 0xff0000, 0.5);
          boundaryIndicator.strokeRect(0, 0, this.game.config.width, this.game.config.height);
          boundaryIndicator.setDepth(997);
          
          // Add keyboard controls
          cursors = this.input.keyboard.createCursorKeys();

          // Create bullets group
          const bullets = this.physics.add.group();

          // Shooting mechanism - mouse click
          this.input.on('pointerdown', (pointer: any) => {
            const bullet = this.add.image(player.x, player.y - 25, 'rocket');
            bullet.setScale(0.06); // Very small rocket as bullet
            this.physics.add.existing(bullet);
            
            // Add glow effect (not to physics group)
            const glow = this.add.circle(player.x, player.y - 25, 20, 0xff0000, 0.3);
            glow.setBlendMode('ADD');
            
            bullets.add(bullet);
            
            if (bullet.body) {
              bullet.body.setVelocityY(-400);
            }
            
            // Move glow with bullet
            this.tweens.add({
              targets: glow,
              y: glow.y - 400,
              duration: 1000,
              onComplete: () => glow.destroy()
            });
            shotsFired++;
            
            // Update accuracy display
            const currentAccuracy = Math.round((shotsHit / shotsFired) * 100);
            setAccuracy(currentAccuracy);
            accuracyText.setText('Accuracy: ' + currentAccuracy + '%');
            
            // Add shooting flash effect
            const flash = this.add.circle(player.x, player.y - 25, 25, 0xffffff, 0.8);
            this.tweens.add({
              targets: flash,
              alpha: 0,
              duration: 200,
              onComplete: () => flash.destroy()
            });
          });
          
          // Shooting mechanism - up arrow key
          this.input.keyboard.on('keydown-UP', () => {
            const bullet = this.add.image(player.x, player.y - 25, 'rocket');
            bullet.setScale(0.06); // Very small rocket as bullet
            this.physics.add.existing(bullet);
            
            // Add glow effect (not to physics group)
            const glow = this.add.circle(player.x, player.y - 25, 20, 0xff0000, 0.3);
            glow.setBlendMode('ADD');
            
            bullets.add(bullet);
            
            if (bullet.body) {
              bullet.body.setVelocityY(-400);
            }
            
            // Move glow with bullet
            this.tweens.add({
              targets: glow,
              y: glow.y - 400,
              duration: 1000,
              onComplete: () => glow.destroy()
            });
            shotsFired++;
            
            // Update accuracy display
            const currentAccuracy = Math.round((shotsHit / shotsFired) * 100);
            setAccuracy(currentAccuracy);
            accuracyText.setText('Accuracy: ' + currentAccuracy + '%');
            
            // Add shooting flash effect
            const flash = this.add.circle(player.x, player.y - 25, 25, 0xffffff, 0.8);
            this.tweens.add({
              targets: flash,
              alpha: 0,
              duration: 200,
              onComplete: () => flash.destroy()
            });
          });

          // Collision detection
          this.physics.add.collider(bullets, stars, (bullet: any, star: any) => {
            console.log('Collision detected!');
            
            // Destroy the bullet and star
            bullet.destroy();
            star.destroy();
            
            // Update score and accuracy
            currentScore += 10;
            shotsHit++;
            const newAccuracy = Math.round((shotsHit / shotsFired) * 100);
            
            // Update both Phaser UI and React state
            setScore(currentScore);
            setAccuracy(newAccuracy);
            scoreText.setText('Score: ' + currentScore);
            accuracyText.setText('Accuracy: ' + newAccuracy + '%');
            
            // Calculate minimum score required for current level (10 + (level-1)*10)
            const minScoreRequired = 10 + (currentLevel - 1) * 10;
            
            // Check if player has won (dynamic score requirement and accuracy >= 60%)
            if (currentScore >= minScoreRequired && newAccuracy >= 60 && !winnerAchieved) {
              winnerAchieved = true;
              // Show winner message in game
              winnerText = this.add.text(this.game.config.width / 2, this.game.config.height / 2 - 50, `🏆 WINNER! 🏆\nScore: ${currentScore}/${minScoreRequired}`, {
                fontSize: '48px',
                color: '#ffff00',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 4
              });
              winnerText.setOrigin(0.5);
              winnerText.setDepth(1000);
              
              // Add celebration effect
              this.tweens.add({
                targets: winnerText,
                scale: 1.2,
                duration: 500,
                yoyo: true,
                repeat: -1
              });
              
              // Call winner handler if provided
              if (onWinnerAchieved) {
                onWinnerAchieved(currentScore, newAccuracy);
              }
              
              console.log('Winner! Score:', currentScore, 'Accuracy:', newAccuracy);
            }
            
            console.log('Star hit! Score:', currentScore, 'Accuracy:', newAccuracy);
          });

          // UI
          scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', color: '#fff' });
          timeText = this.add.text(16, 50, 'Time: 0', { fontSize: '24px', color: '#fff' });
          
          // Add accuracy display
          const accuracyText = this.add.text(16, 84, 'Accuracy: 100%', { fontSize: '20px', color: '#fff' });
          
          // Calculate minimum score required for current level
          const minScoreRequired = 10 + (currentLevel - 1) * 10;
          
          // Add level display
          const levelText = this.add.text(this.game.config.width - 16, 50, `Level: ${currentLevel}`, { 
            fontSize: '24px', 
            color: '#ffff00',
            fontStyle: 'bold'
          });
          levelText.setOrigin(1, 0);
          
          // Add score requirement display
          const scoreReqText = this.add.text(this.game.config.width - 16, 80, `Target: ${minScoreRequired}`, { 
            fontSize: '18px', 
            color: '#00ff00',
            fontStyle: 'bold'
          });
          scoreReqText.setOrigin(1, 0);
          
          // Initialize React state with current values
          currentScore = 0;
          winnerAchieved = false;
          shotsFired = 0;
          shotsHit = 0;
          setScore(0);
          setTime(0);
          setAccuracy(100);
          
          // Show level start message
          const levelStartText = this.add.text(this.game.config.width / 2, this.game.config.height / 2, `Level ${currentLevel}`, {
            fontSize: '64px',
            color: '#ffff00',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6
          });
          levelStartText.setOrigin(0.5);
          levelStartText.setDepth(1000);
          
          // Animate level start message
          this.tweens.add({
            targets: levelStartText,
            scale: 1.5,
            alpha: 0,
            duration: 2000,
            onComplete: () => levelStartText.destroy()
          });
          
          // Controls instruction
          const controlsText = this.add.text(this.game.config.width - 16, 16, '🚀 CONTROLS:\n← → Move Rocket\n↑ Fire Missile\nClick Fire Missile', { 
            fontSize: '14px', 
            color: '#ffff00',
            fontStyle: 'bold'
          });
          controlsText.setOrigin(1, 0);
          
          // Level progress bar
          progressBar = this.add.graphics();
          progressBar.fillStyle(0x00ff00);
          progressBar.fillRect(16, 80, 200, 10);

          setIsLoading(false);
        }

        function update(this: any, time: number, delta: number) {
          // Check if game is still running
          if (!this.game || this.game.destroyed) {
            return;
          }
          
          gameTime += delta;
          levelTime += delta;
          const currentTime = Math.floor(gameTime / 1000);
          setTime(currentTime);
          timeText.setText('Time: ' + currentTime);

          // Player movement controls
          if (cursors.left.isDown) {
            player.body.setVelocityX(-200);
          } else if (cursors.right.isDown) {
            player.body.setVelocityX(200);
          } else {
            player.body.setVelocityX(0);
          }

          // Continuously spawn stars
          starSpawnTimer += delta;
          if (starSpawnTimer > 1000) { // Spawn every 1 second
            spawnStar(this);
            starSpawnTimer = 0;
          }

          // Update progress bar
          const progress = Math.min(levelTime / 30000, 1);
          progressBar.clear();
          progressBar.fillStyle(0x00ff00);
          progressBar.fillRect(16, 80, 200 * progress, 10);
          
          // Level completion - after 30 seconds
          if (levelTime > 30000) { // 30 seconds
            onGameEnd(score, accuracy);
          }
        }

        return () => {
          window.removeEventListener('resize', handleResize);
          if (gameInstance && !gameInstance.destroyed) {
            try {
              gameInstance.destroy(true);
            } catch (error) {
              console.error('Error destroying game:', error);
            }
          }
        };
      });
    }
  }, [onGameEnd]); // Only depend on onGameEnd, not score/accuracy

  return (
    <div className="relative w-full h-full flex flex-col">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-space-900 z-10">
          <div
            className="w-16 h-16 border-4 border-space-400 border-t-star-gold rounded-full animate-spin"
          />
        </div>
      )}
      
      <div className="flex justify-between items-center p-4 bg-space-800/50 z-20">
        <div className="text-white">
          <div>Score: {score}</div>
          <div>Time: {time}s</div>
          <div>Accuracy: {accuracy}%</div>
        </div>
        <button
          onClick={onPause}
          className="btn-secondary"
        >
          ⏸️ Pause
        </button>
      </div>
      
      <div 
        ref={gameRef} 
        className="flex-1 w-full bg-gradient-to-b from-black via-blue-900 to-purple-900" 
        style={{ minHeight: '400px' }}
      >
        {/* Fallback content if game fails to load */}
        {!isLoading && (
          <div className="w-full h-full flex items-center justify-center text-white">
            <div className="text-center">
              <div className="text-2xl mb-4">🌟 Shooting the Star</div>
              <div className="text-sm opacity-75">Game is loading...</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 