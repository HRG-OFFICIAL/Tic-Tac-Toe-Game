import { useGameStore } from '@/store/gameStore';
import type { GameSettings } from '@/types/game';
import { SoundManager } from '@/utils/soundManager';
import { AnimationManager } from '@/utils/animationManager';

export class SettingsModal {
  private container: HTMLElement;
  private gameStore = useGameStore;
  private soundManager = SoundManager.getInstance();
  private animationManager = AnimationManager.getInstance();

  constructor(container: HTMLElement) {
    this.container = container;
    this.render();
    this.setupEventListeners();
  }

  render(): void {
    this.container.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>Game Settings</h3>
          <button id="close-settings" class="btn-close">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="setting-group">
            <label for="game-mode">Game Mode</label>
            <select id="game-mode" class="form-select">
              <option value="human-vs-human">Human vs Human</option>
              <option value="human-vs-ai">Human vs AI</option>
            </select>
          </div>

          <div class="setting-group">
            <label for="ai-difficulty">AI Difficulty</label>
            <select id="ai-difficulty" class="form-select">
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div class="setting-group">
            <label for="board-size">Board Size</label>
            <select id="board-size" class="form-select">
              <option value="3">3x3 (Classic)</option>
              <option value="4">4x4</option>
              <option value="5">5x5</option>
            </select>
          </div>

          <div class="setting-group">
            <label class="checkbox-label">
              <input type="checkbox" id="sound-enabled" class="form-checkbox">
              <span class="checkmark"></span>
              Enable Sound Effects
            </label>
          </div>

                  <div class="setting-group">
                    <label class="checkbox-label">
                      <input type="checkbox" id="animations-enabled" class="form-checkbox">
                      <span class="checkmark"></span>
                      Enable Animations
                    </label>
                  </div>

                  <div class="setting-group">
                    <label for="theme">Theme</label>
                    <select id="theme" class="form-select">
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                    </select>
                  </div>
                </div>

        <div class="modal-footer">
          <button id="save-settings" class="btn btn-primary">Save Settings</button>
          <button id="cancel-settings" class="btn btn-secondary">Cancel</button>
        </div>
      </div>
    `;
  }

  private setupEventListeners(): void {
    const closeBtn = this.container.querySelector('#close-settings');
    const cancelBtn = this.container.querySelector('#cancel-settings');
    const saveBtn = this.container.querySelector('#save-settings');

    // Close modal handlers
    [closeBtn, cancelBtn].forEach(btn => {
      btn?.addEventListener('click', () => this.close());
    });

    // Save settings
    saveBtn?.addEventListener('click', () => this.saveSettings());

    // Close on backdrop click
    this.container.addEventListener('click', (e) => {
      if (e.target === this.container) {
        this.close();
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.container.classList.contains('active')) {
        this.close();
      }
    });
  }

  show(): void {
    this.loadCurrentSettings();
    this.container.classList.add('active');
  }

  close(): void {
    this.container.classList.remove('active');
  }

  private loadCurrentSettings(): void {
    const settings = this.gameStore.getState().settings;
    
    const gameModeSelect = this.container.querySelector('#game-mode') as HTMLSelectElement;
    const aiDifficultySelect = this.container.querySelector('#ai-difficulty') as HTMLSelectElement;
    const boardSizeSelect = this.container.querySelector('#board-size') as HTMLSelectElement;
    const soundCheckbox = this.container.querySelector('#sound-enabled') as HTMLInputElement;
    const animationsCheckbox = this.container.querySelector('#animations-enabled') as HTMLInputElement;
    const themeSelect = this.container.querySelector('#theme') as HTMLSelectElement;

    if (gameModeSelect) gameModeSelect.value = settings.mode;
    if (aiDifficultySelect) aiDifficultySelect.value = settings.aiDifficulty;
    if (boardSizeSelect) boardSizeSelect.value = settings.boardSize.toString();
    if (soundCheckbox) soundCheckbox.checked = settings.soundEnabled;
    if (animationsCheckbox) animationsCheckbox.checked = settings.animationsEnabled;
    if (themeSelect) themeSelect.value = settings.theme;
  }

  private saveSettings(): void {
    const gameModeSelect = this.container.querySelector('#game-mode') as HTMLSelectElement;
    const aiDifficultySelect = this.container.querySelector('#ai-difficulty') as HTMLSelectElement;
    const boardSizeSelect = this.container.querySelector('#board-size') as HTMLSelectElement;
    const soundCheckbox = this.container.querySelector('#sound-enabled') as HTMLInputElement;
    const animationsCheckbox = this.container.querySelector('#animations-enabled') as HTMLInputElement;
    const themeSelect = this.container.querySelector('#theme') as HTMLSelectElement;

    const newSettings: Partial<GameSettings> = {
      mode: gameModeSelect?.value as GameSettings['mode'],
      aiDifficulty: aiDifficultySelect?.value as GameSettings['aiDifficulty'],
      boardSize: parseInt(boardSizeSelect?.value || '3') as GameSettings['boardSize'],
      soundEnabled: soundCheckbox?.checked ?? true,
      animationsEnabled: animationsCheckbox?.checked ?? true,
      theme: themeSelect?.value as GameSettings['theme']
    };

    this.gameStore.getState().updateSettings(newSettings);
    
    // Sync with sound and animation managers
    this.soundManager.setSoundEnabled(newSettings.soundEnabled ?? true);
    this.animationManager.setAnimationsEnabled(newSettings.animationsEnabled ?? true);
    
    this.close();
  }
}
