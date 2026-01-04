import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
  title?: string; // Título personalizado opcional
  action?: NotificationAction; // Acción opcional
}

export interface NotificationAction {
  label: string;
  callback: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private notificationSubject = new Subject<Notification>();
  public notifications$ = this.notificationSubject.asObservable();

  // Duraciones predefinidas
  private readonly DURATION_SHORT = 2000;
  private readonly DURATION_MEDIUM = 3000;
  private readonly DURATION_LONG = 5000;

  // ============================================================
  // Mostrar notificación personalizada
  // ============================================================
  show(
    type: 'success' | 'error' | 'info' | 'warning',
    message: string,
    duration: number = this.DURATION_MEDIUM,
    title?: string,
    action?: NotificationAction
  ) {
    const notification: Notification = {
      id: this.generateId(),
      type,
      message,
      duration,
      title,
      action
    };

    this.notificationSubject.next(notification);
  }

  // ============================================================
  // Métodos de ayuda para tipos específicos
  // ============================================================
  
  /**
   * Muestra una notificación de éxito
   */
  success(message: string, duration?: number, title?: string) {
    this.show('success', message, duration || this.DURATION_MEDIUM, title);
  }

  /**
   * Muestra una notificación de error
   */
  error(message: string, duration?: number, title?: string) {
    this.show('error', message, duration || this.DURATION_LONG, title);
  }

  /**
   * Muestra una notificación informativa
   */
  info(message: string, duration?: number, title?: string) {
    this.show('info', message, duration || this.DURATION_MEDIUM, title);
  }

  /**
   * Muestra una notificación de advertencia
   */
  warning(message: string, duration?: number, title?: string) {
    this.show('warning', message, duration || this.DURATION_LONG, title);
  }

  // ============================================================
  // Métodos de ayuda para mensajes comunes
  // ============================================================

  /**
   * Notificación de éxito al guardar
   */
  saveSuccess(entityName: string = 'Elemento') {
    this.success(`${entityName} guardado correctamente`);
  }

  /**
   * Notificación de éxito al actualizar
   */
  updateSuccess(entityName: string = 'Elemento') {
    this.success(`${entityName} actualizado correctamente`);
  }

  /**
   * Notificación de éxito al eliminar
   */
  deleteSuccess(entityName: string = 'Elemento') {
    this.success(`${entityName} eliminado correctamente`);
  }

  /**
   * Notificación de error genérico
   */
  errorOccurred(customMessage?: string) {
    this.error(customMessage || 'Ocurrió un error. Por favor, intenta nuevamente.');
  }

  /**
   * Notificación de error de conexión
   */
  connectionError() {
    this.error('Error de conexión. Verifica tu conexión a internet.');
  }

  /**
   * Notificación de acción no permitida
   */
  notAllowed(reason?: string) {
    this.warning(reason || 'No tienes permisos para realizar esta acción.');
  }

  /**
   * Notificación de campo requerido
   */
  fieldRequired(fieldName: string) {
    this.warning(`El campo "${fieldName}" es requerido.`);
  }

  /**
   * Notificación de carga
   */
  loading(message: string = 'Cargando...') {
    this.info(message, 0); // Sin duración, debe cerrarse manualmente
  }

  // ============================================================
  // Notificaciones con acción
  // ============================================================

  /**
   * Muestra una notificación con un botón de acción
   */
  showWithAction(
    type: 'success' | 'error' | 'info' | 'warning',
    message: string,
    actionLabel: string,
    actionCallback: () => void,
    duration?: number
  ) {
    this.show(
      type,
      message,
      duration || this.DURATION_LONG,
      undefined,
      { label: actionLabel, callback: actionCallback }
    );
  }

  /**
   * Notificación de deshacer eliminación
   */
  deletedWithUndo(entityName: string, undoCallback: () => void) {
    this.showWithAction(
      'warning',
      `${entityName} eliminado`,
      'Deshacer',
      undoCallback,
      this.DURATION_LONG
    );
  }

  // ============================================================
  // Utilidades
  // ============================================================

  /**
   * Genera un ID único para cada notificación
   */
  private generateId(): string {
    return `notification-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 11)}`;
  }

  /**
   * Obtiene las duraciones predefinidas
   */
  getDurations() {
    return {
      short: this.DURATION_SHORT,
      medium: this.DURATION_MEDIUM,
      long: this.DURATION_LONG
    };
  }
}