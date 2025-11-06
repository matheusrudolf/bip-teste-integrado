import { MessageService } from 'primeng/api';
import { inject, Injectable } from '@angular/core';

const DEFGAULT_MESSAGE_LIFE: number = 3000;

@Injectable({
    providedIn: 'root'
})
export class MessageUtil {
    private readonly MessageService = inject(MessageService);
    private readonly life = DEFGAULT_MESSAGE_LIFE;

    public success(message: string, summary?: string): void {
        this.MessageService.add({ severity: 'success', summary, detail: message, life: this.life });
    }

    public info(message: string, summary?: string): void {
        this.MessageService.add({ severity: 'info', summary, detail: message, life: this.life });
    }

    public warn(message: string, summary?: string): void {
        this.MessageService.add({ severity: 'warn', summary, detail: message, life: this.life });
    }

    public error(message: string, summary?: string): void {
        this.MessageService.add({ severity: 'error', summary, detail: message, life: this.life });
    }

}
