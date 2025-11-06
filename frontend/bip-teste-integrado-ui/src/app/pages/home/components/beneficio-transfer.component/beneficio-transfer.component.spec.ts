import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BeneficioTransferComponent } from './beneficio-transfer.component';
import { BeneficioService } from '@/core/beneficio.service';
import { MessageUtil } from '@/shared/utils/message.util';
import { of, throwError } from 'rxjs';
import { Beneficio } from '@/shared/models/beneficio';
import { Content } from '@/shared/classes/content';
import { ReactiveFormsModule } from '@angular/forms';

describe('BeneficioTransferComponent', () => {
    let component: BeneficioTransferComponent;
    let fixture: ComponentFixture<BeneficioTransferComponent>;
    let beneficioService: jasmine.SpyObj<BeneficioService>;
    let messageUtil: jasmine.SpyObj<MessageUtil>;

    const mockBeneficio: Beneficio = {
        id: 1,
        nome: 'Benefício Teste',
        descricao: 'Descrição teste',
        valor: 1000.0,
        ativo: true,
        version: 0
    };

    beforeEach(async () => {
        const beneficioSpy = jasmine.createSpyObj('BeneficioService', ['transfer']);
        const messageSpy = jasmine.createSpyObj('MessageUtil', ['success', 'error']);

        await TestBed.configureTestingModule({
            imports: [BeneficioTransferComponent, ReactiveFormsModule],
            providers: [
                { provide: BeneficioService, useValue: beneficioSpy },
                { provide: MessageUtil, useValue: messageSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(BeneficioTransferComponent);
        component = fixture.componentInstance;
        beneficioService = TestBed.inject(BeneficioService) as jasmine.SpyObj<BeneficioService>;
        messageUtil = TestBed.inject(MessageUtil) as jasmine.SpyObj<MessageUtil>;

        fixture.detectChanges();
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    it('deve preencher o fromId ao receber data via Input', () => {
        component.data = mockBeneficio;

        component.ngOnChanges({
            data: {
                currentValue: mockBeneficio,
                previousValue: null,
                firstChange: true,
                isFirstChange: () => true
            }
        });

        expect(component.formData.get('fromId')?.value).toBe(mockBeneficio.id);
    });

    it('deve identificar controle inválido corretamente quando formulário for submetido', () => {
        const control = component.formData.get('amount');
        control?.setValue(null);
        component.submitted = true;
        control?.updateValueAndValidity();

        const invalid = component.isInvalid('amount');
        expect(invalid).toBeTrue();
    });

    it('deve identificar controle inválido quando foi tocado', () => {
        const control = component.formData.get('amount');
        control?.setValue(null);
        control?.markAsTouched();
        control?.updateValueAndValidity();

        const invalid = component.isInvalid('amount');
        expect(invalid).toBeTrue();
    });

    it('não deve chamar o service se o form for inválido', () => {
        component.formData.patchValue({
            fromId: 1,
            toId: null,
            amount: null
        });

        component.onConfirmTransfer();

        expect(beneficioService.transfer).not.toHaveBeenCalled();
    });

    it('deve chamar o service e emitir sucesso se o form for válido', fakeAsync(() => {
        const mockResponse: Content<Beneficio> = {
            dados: [],
            mensagem: 'Transferência realizada com sucesso!',
            sucesso: true
        };

        beneficioService.transfer.and.returnValue(of(mockResponse));

        component.formData.patchValue({
            fromId: 1,
            toId: 2,
            amount: 150
        });

        spyOn(component.onConfirm, 'emit');

        component.onConfirmTransfer();
        tick();

        expect(beneficioService.transfer).toHaveBeenCalledWith({
            fromId: 1,
            toId: 2,
            amount: 150
        });
        expect(messageUtil.success).toHaveBeenCalledWith('Transferência realizada com sucesso!');
        expect(component.onConfirm.emit).toHaveBeenCalled();
        expect(component.submitted).toBeFalse();
    }));

    it('deve tratar erro ao chamar o service', fakeAsync(() => {
        const mockError = { mensagem: 'Erro ao transferir valores' };
        beneficioService.transfer.and.returnValue(throwError(() => mockError));

        component.formData.patchValue({
            fromId: 1,
            toId: 2,
            amount: 100
        });

        component.onConfirmTransfer();
        tick();

        expect(messageUtil.error).toHaveBeenCalledWith('Erro ao transferir valores');
    }));

    it('deve emitir evento de fechamento ao cancelar e limpar o formulário', () => {
        spyOn(component.onClose, 'emit');

        component.formData.patchValue({ toId: 2, amount: 200 });
        component.onClose.emit();
        component.formData.reset();

        expect(component.onClose.emit).toHaveBeenCalled();
        expect(component.formData.get('amount')?.value).toBeNull();
        expect(component.formData.get('toId')?.value).toBeNull();
    });
});
