import { MessageModule } from 'primeng/message';
import { FloatLabelModule } from 'primeng/floatlabel';
import { Beneficio } from '@/shared/models/beneficio';
import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { BeneficioService } from '@/core/beneficio.service';
import { MessageUtil } from '@/shared/utils/message.util';

@Component({
    selector: 'app-beneficio-cadastro',
    standalone: true,
    imports: [DialogModule, ButtonModule, InputTextModule, FloatLabelModule, ReactiveFormsModule, InputNumberModule, CheckboxModule, MessageModule],
    template: `
    <p-dialog [header]="state === 'add' ? 'Cadastrar Benefício' : 'Alterar Beneficio'" [(visible)]="visible" [closable]="true"
        [modal]="true" (onHide)="onClose.emit()" [style]="{ width: '50rem' }">

        <form [formGroup]="formData" class="grid grid-cols-12 sm:grid-cols-1 gap-4 mt-6">
            <p-floatlabel class="col-span-12 md:col-span-5">
                <input pInputText type="text" maxlength="100" formControlName="nome"
                    [invalid]="isInvalid('nome')" fluid>
                <label for="nome">Nome</label>
            </p-floatlabel>
            <p-floatlabel class="col-span-12 md:col-span-5">
                <input pInputText type="text" maxlength="255" formControlName="descricao"
                    [invalid]="isInvalid('descricao')" fluid>
                <label for="descricao">Descrição</label>
            </p-floatlabel>
            <p-floatlabel class="col-span-12 md:col-span-2">
                <p-inputnumber inputId="minmaxfraction" mode="decimal" [minFractionDigits]="2"
                    [maxFractionDigits]="2" formControlName="valor" [invalid]="isInvalid('valor')" fluid />
                <label for="valor">Valor</label>
            </p-floatlabel>
            <div class="col-span-12">
                <div class="flex flex-wrap gap-4">
                    <p-checkbox formControlName="ativo" [binary]="true" fluid />
                    <label for="ativo">Ativo</label>
                </div>
            </div>
        </form>

        <div class="mt-4">
            @if (isInvalid('nome')) {
                <p-message severity="error" size="small" variant="simple">Nome é obrigatório.</p-message>
            }

            @if (isInvalid('descricao')) {
                <p-message severity="error" size="small" variant="simple">Descrição é obrigatório.</p-message>
            }

            @if (isInvalid('valor')) {
                <p-message severity="error" size="small" variant="simple">Valor é obrigatório.</p-message>
            }
        </div>

        <ng-template #footer>
            <p-button label="Confirmar" severity="secondary" outlined (onClick)="onConfirmRegister()" />
            <p-button label="Cancelar" severity="danger" (onClick)="onClose.emit()" />
        </ng-template>
    </p-dialog>
  `
})
export class BeneficioCadastroComponent implements OnChanges {
    private readonly beneficioService = inject(BeneficioService);
    private readonly messageUtil = inject(MessageUtil);

    @Input() visible: boolean;
    @Input() state: string;
    @Input() data: Beneficio;

    @Output() onClose: EventEmitter<void> = new EventEmitter<void>();
    @Output() onConfirm: EventEmitter<void> = new EventEmitter<void>();

    public formData: FormGroup = new FormGroup({
        nome: new FormControl('', Validators.required),
        descricao: new FormControl('', Validators.required),
        valor: new FormControl(0.00, Validators.required),
        ativo: new FormControl(true),
    })

    public submitted: boolean = false;

    ngOnChanges(_changes: SimpleChanges): void {
        this.submitted = false;

        if (this.data) {
            this.formData.patchValue(this.data);
        } else {
            this.formData.reset({
                nome: '',
                descricao: '',
                valor: 0.00,
                ativo: true
            });
        }
    }

    public onConfirmRegister(): void {
        this.submitted = true;

        if (this.formData.valid) {
            const req = this.data
                ? this.beneficioService.atualizar(this.data.id, this.formData.value)
                : this.beneficioService.adicionar(this.formData.value);

            req.subscribe({
                next: (res) => {
                    this.submitted = false;
                    this.messageUtil.success(res.mensagem);
                    this.onConfirm.emit();
                },
                error: (err) => this.messageUtil.error(err.error.mensagem)
            });
        }
    }

    public isInvalid(controlName: string) {
        const control = this.formData.get(controlName);
        return control?.invalid && (control.touched || this.submitted);
    }
}
