import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { NotificationService, Notification } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(120%) scale(0.8)', opacity: 0 }),
        animate('400ms cubic-bezier(0.68, -0.55, 0.265, 1.55)', 
          style({ transform: 'translateX(0) scale(1)', opacity: 1 }))
      ])
    ]),
    trigger('fadeOut', [
      transition(':leave', [
        animate('300ms ease-out', 
          style({ transform: 'translateX(120%) scale(0.8)', opacity: 0 }))
      ])
    ])
  ]
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription?: Subscription;
  private maxNotifications = 5;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.subscription = this.notificationService.notifications$.subscribe(
      (notification) => {
        if (this.notifications.length >= this.maxNotifications) {
          this.notifications.shift();
        }
        this.notifications.push(notification);
        
        if (notification.duration) {
          setTimeout(() => {
            this.removeNotification(notification.id);
          }, notification.duration);
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  removeNotification(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  clearAll() {
    this.notifications = [];
  }

  getIcon(type: string): string {
    switch(type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '⚠';
      case 'info': return 'ℹ';
      default: return '●';
    }
  }

  getPokemonEmoji(type: string): string {
    switch(type) {
      case 'success': return '⚡';
      case 'error': return '🔥';
      case 'warning': return '⭐';
      case 'info': return '💧';
      default: return '⚪';
    }
  }

  getTitle(type: string): string {
    switch(type) {
      case 'success': return '¡Éxito!';
      case 'error': return '¡Error!';
      case 'warning': return '¡Advertencia!';
      case 'info': return 'Información';
      default: return 'Notificación';
    }
  }

  trackByFn = (index: number, item: Notification): string => {
    return item.id;
  }
}