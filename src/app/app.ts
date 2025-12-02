import {Component, inject, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {HeaderComponent} from '../header-component/header-component';
import {NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, NgOptimizedImage],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Doigby-API');
}
