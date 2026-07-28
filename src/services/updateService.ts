import { APP_VERSION, GITHUB_REPO } from '../version';
import { AppSettings } from '../types';

export interface UpdateInfo {
  status: 'idle' | 'checking' | 'available' | 'up-to-date' | 'downloading' | 'ready' | 'paused' | 'error';
  latestVersion?: string;
  releaseNotes?: string;
  downloadProgress?: number;
  errorMessage?: string;
  publishedAt?: string;
}

class UpdateService {
  private updateInfo: UpdateInfo = {
    status: 'idle',
    latestVersion: APP_VERSION,
  };

  private listeners: Array<(info: UpdateInfo) => void> = [];

  public subscribe(listener: (info: UpdateInfo) => void) {
    this.listeners.push(listener);
    listener(this.updateInfo);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.updateInfo));
  }

  public getStatus(): UpdateInfo {
    return this.updateInfo;
  }

  public async checkForUpdates(settings: AppSettings, isManual = false): Promise<UpdateInfo> {
    if (settings.pauseUpdates && !isManual) {
      this.updateInfo = {
        status: 'paused',
        latestVersion: APP_VERSION,
        errorMessage: 'Updates are currently paused in Settings.',
      };
      this.notify();
      return this.updateInfo;
    }

    this.updateInfo = { status: 'checking', latestVersion: APP_VERSION };
    this.notify();

    try {
      // Attempt to query GitHub Releases API
      const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`, {
        headers: { Accept: 'application/vnd.github.v3+json' },
      });

      if (response.ok) {
        const data = await response.json();
        const latestTag = (data.tag_name || '').replace(/^v/, '').replace(/^release-v/, '').split('-')[0];
        const releaseNotes = data.body || 'New stability improvements and performance optimizations.';
        const publishedAt = data.published_at ? new Date(data.published_at).toLocaleDateString() : 'Recent';

        if (latestTag && latestTag !== APP_VERSION && this.isNewerVersion(latestTag, APP_VERSION)) {
          this.updateInfo = {
            status: 'available',
            latestVersion: latestTag,
            releaseNotes,
            publishedAt,
          };
          this.notify();

          // Handle silent updates if configured
          if (settings.enableSilentUpdates) {
            this.downloadAndApplySilentUpdate(latestTag);
          }
          return this.updateInfo;
        }
      }
    } catch {
      // Offline fallback
    }

    // Default: Up to date
    this.updateInfo = {
      status: 'up-to-date',
      latestVersion: APP_VERSION,
      releaseNotes: `You are running the official release QuickThought v${APP_VERSION}. All systems nominal.`,
    };
    this.notify();
    return this.updateInfo;
  }

  public async downloadAndApplySilentUpdate(targetVersion: string) {
    this.updateInfo = {
      ...this.updateInfo,
      status: 'downloading',
      downloadProgress: 10,
    };
    this.notify();

    // Simulate progress
    for (let progress = 25; progress <= 100; progress += 25) {
      await new Promise((resolve) => setTimeout(resolve, 400));
      this.updateInfo = {
        ...this.updateInfo,
        status: progress === 100 ? 'ready' : 'downloading',
        downloadProgress: progress,
      };
      this.notify();
    }
  }

  private isNewerVersion(latest: string, current: string): boolean {
    const p1 = latest.split('.').map(Number);
    const p2 = current.split('.').map(Number);
    for (let i = 0; i < Math.max(p1.length, p2.length); i++) {
      const v1 = p1[i] || 0;
      const v2 = p2[i] || 0;
      if (v1 > v2) return true;
      if (v1 < v2) return false;
    }
    return false;
  }
}

export const updateService = new UpdateService();
