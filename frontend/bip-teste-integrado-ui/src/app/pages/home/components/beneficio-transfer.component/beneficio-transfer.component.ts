import { BeneficioService } from '@/core/beneficio.service';
import { Beneficio } from '@/shared/models/beneficio';
import { MessageUtil } from '@/shared/utils/message.util';
import { CurrencyPipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';

@Component({
    selector: 'app-beneficio-transfer',
    standalone: true,
    imports: [DialogModule, ButtonModule, SelectModule, ReactiveFormsModule, InputNumberModule, FloatLabelModule, CurrencyPipe],
    template: `
        <p-dialog header="Transferir Saldo" [(visible)]="visible" [closable]="true" [modal]="true"
            (onHide)="onClose.emit()" [style]="{ width: '50rem' }">

            <div class="flex justify-between">
                <h4 class="text-slate-400"> {{ data?.nome }} </h4>
                <h4>Saldo: {{ data?.valor | currency : 'BRL' }} </h4>
            </div>
            <div class="mt-5 pl-4">
                <p>Você está transferindo valor do saldo de {{ data?.nome }} </p>
                <p>Selecione para qual benefício de destino será feita a transferência</p>
            </div>

            <form [formGroup]="formData" class="grid grid-cols-12 gap-4 mt-8">
                <p-floatlabel class="col-span-8">
                    <p-select [options]="options" formControlName="toId" optionLabel="label" optionValue="id"
                        [invalid]="isInvalid('toId')" fluid appendTo="body" />
                    <label for="toId">Benefício destino</label>
                </p-floatlabel>

                <p-floatlabel class="col-span-4">
                    <p-inputnumber inputId="minmaxfraction" mode="decimal" [minFractionDigits]="2"
                        [maxFractionDigits]="2" formControlName="amount" [invalid]="isInvalid('amount')" fluid />
                    <label for="amount">Valor</label>
                </p-floatlabel>
            </form>

            <ng-template #footer>
                <p-button label="Confirmar" severity="secondary" outlined (onClick)="onConfirmTransfer()" />
                <p-button label="Cancelar" severity="danger" (onClick)="onClose.emit();formData.reset()" />
            </ng-template>
        </p-dialog>
    `
})
export class BeneficioTransferComponent implements OnChanges {
    private readonly beneficioService = inject(BeneficioService);
    private readonly messageUtil = inject(MessageUtil);

    @Input() visible: boolean;
    @Input() data: Beneficio;
    @Input() options: any[];

    @Output() onClose: EventEmitter<void> = new EventEmitter<void>();
    @Output() onConfirm: EventEmitter<void> = new EventEmitter<void>();

    public formData: FormGroup = new FormGroup({
        fromId: new FormControl(null),
        toId: new FormControl(null),
        amount: new FormControl(0.00, Validators.required),
    });

    public submitted: boolean = false;

    ngOnChanges(_changes: SimpleChanges): void {
        if (this.data) {
            this.formData.patchValue({
                fromId: this.data.id
            });
        }
    }

    public isInvalid(controlName: string) {
        const control = this.formData.get(controlName);
        return control?.invalid && (control.touched || this.submitted);
    }

    public onConfirmTransfer(): void {
        this.submitted = true;

        if (this.formData.valid) {
            this.beneficioService.transfer(this.formData.value).subscribe({
                next: (res) => {
                    this.submitted = false;
                    this.messageUtil.success(res.mensagem);
                    this.onConfirm.emit();
                },
                error: (err) => this.messageUtil.error(err.error.mensagem)
            });
        }
    }
}
