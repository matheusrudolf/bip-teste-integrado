import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterModule, ConfirmDialogModule, ToastModule, ButtonModule],
    template: `
        <router-outlet></router-outlet>

        <p-confirmdialog #confirm>
            <ng-template #footer let-footer>
                <p-button label="Confirmar" severity="secondary" outlined (onClick)="confirm.onAccept()" />
                <p-button label="Cancelar" severity="danger" (onClick)="confirm.onReject()" />
            </ng-template>
        </p-confirmdialog>

        <p-toast position="bottom-center" />
    `
})
export class AppComponent { }
