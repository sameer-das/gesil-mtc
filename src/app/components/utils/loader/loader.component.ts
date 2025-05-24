import { Component, computed } from '@angular/core';
import { LoaderService } from '../../../services/loader.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
@Component({
  selector: 'loader',
  imports: [ProgressSpinnerModule],
  template: `
    @if(loading()) {
    <div class="loader-overlay">
      <p-progress-spinner strokeWidth="8" fill="transparent" animationDuration=".5s" [style]="{ width: '50px', height: '50px' }" />
    </div>
    }
    
  `,
  styles: `
      .loader-overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          background: rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 6px solid #ccc;
          border-top: 6px solid var(--primary-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
  `
})
export class LoaderComponent {
  loading = computed(() => this.loaderService.loading());

  constructor(private loaderService: LoaderService) { }
}
