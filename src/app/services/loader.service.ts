import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor() { }

   private _loading = signal(false);

  readonly loading = computed(() => this._loading());

  show() {
    this._loading.set(true);
  }

  hide() {
    this._loading.set(false);
  }

  toggle() {
    this._loading.update((val) => !val);
  }
}
