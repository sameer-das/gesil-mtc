import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  template: `
    <div class="layout-footer">
        © Copyright 2025  
        <a href="https://www.gesil.co.in/" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">Global e-Village Services India Ltd.</a>
        All Rights Reserved.
    </div>
  `,
  styles: `
  .layout-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem 0 1rem 0;
    gap: 0.5rem;
    border-top: 1px solid var(--surface-border);
}
  `
})
export class FooterComponent {

}
