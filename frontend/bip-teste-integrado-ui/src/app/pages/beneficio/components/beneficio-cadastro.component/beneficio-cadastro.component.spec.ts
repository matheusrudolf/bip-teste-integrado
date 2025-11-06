import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BeneficioCadastroComponent } from './beneficio-cadastro.component';
import { BeneficioService } from '@/core/beneficio.service';
import { MessageUtil } from '@/shared/utils/message.util';
import { of, throwError } from 'rxjs';
import { Beneficio } from '@/shared/models/beneficio';

describe('BeneficioCadastroComponent', () => {
    let component: BeneficioCadastroComponent;
    let fixture: ComponentFixture<BeneficioCadastroComponent>;
    let beneficioServiceSpy: jasmine.SpyObj<BeneficioService>;
    let messageUtilSpy: jasmine.SpyObj<MessageUtil>;

    beforeEach(async () => {
        beneficioServiceSpy = jasmine.createSpyObj('BeneficioService', ['adicionar', 'atualizar']);
        messageUtilSpy = jasmine.createSpyObj('MessageUtil', ['success', 'error']);

        await TestBed.configureTestingModule({
            imports: [BeneficioCadastroComponent],
            providers: [
                { provide: BeneficioService, useValue: beneficioServiceSpy },
                { provide: MessageUtil, useValue: messageUtilSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(BeneficioCadastroComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('deve criar o componente corretamente', () => {
        expect(component).toBeTruthy();
    });

    it('deve preencher o formData quando data for fornecido', () => {
        const mockData: Beneficio = {
            id: 1,
            nome: 'Auxílio Teste',
            descricao: 'Descrição teste',
            valor: 500,
            ativo: true
        };

        component.data = mockData;
        component.ngOnChanges({ data: { currentValue: mockData, previousValue: null, firstChange: true, isFirstChange: () => true } });

        expect(component.formData.value).toEqual(jasmine.objectContaining({
            nome: mockData.nome,
            descricao: mockData.descricao,
            valor: mockData.valor,
            ativo: mockData.ativo
        }));
    });

    it('deve resetar o formData quando data for nulo', () => {
        component.data = null!;
        component.ngOnChanges({ data: { currentValue: null, previousValue: { id: 1 }, firstChange: false, isFirstChange: () => false } });

        expect(component.formData.value).toEqual({
            nome: '',
            descricao: '',
            valor: 0.00,
            ativo: true
        });
    });

    it('deve chamar beneficioService.adicionar e emitir onConfirm ao confirmar cadastro', () => {
        const mockResponse = {
            dados: null,
            sucesso: true,
            mensagem: 'Beneficio inserido com sucesso!'
        };
        beneficioServiceSpy.adicionar.and.returnValue(of(mockResponse));

        component.data = null!;
        component.formData.setValue({ nome: 'Novo', descricao: 'Teste', valor: 100, ativo: true });

        spyOn(component.onConfirm, 'emit');

        component.onConfirmRegister();

        expect(beneficioServiceSpy.adicionar).toHaveBeenCalledWith(component.formData.value);
        expect(messageUtilSpy.success).toHaveBeenCalledWith('Beneficio inserido com sucesso!');
        expect(component.onConfirm.emit).toHaveBeenCalled();
        expect(component.submitted).toBeFalse();
    });

    it('deve chamar beneficioService.atualizar e emitir onConfirm ao confirmar atualização', () => {
        const mockResponse = {
            dados: null,
            sucesso: true,
            mensagem: 'Beneficio alterado com sucesso!'
        };
        beneficioServiceSpy.atualizar.and.returnValue(of(mockResponse));

        const data: Beneficio = {
            id: 5,
            nome: 'Benefício Existente',
            descricao: 'Desc',
            valor: 500,
            ativo: true
        };

        const expectedPayload = {
            nome: data.nome,
            descricao: data.descricao,
            valor: data.valor,
            ativo: data.ativo
        };


        component.data = data;
        component.formData.patchValue(data);

        spyOn(component.onConfirm, 'emit');

        component.onConfirmRegister();

        expect(beneficioServiceSpy.atualizar).toHaveBeenCalledWith(5, expectedPayload);
        expect(messageUtilSpy.success).toHaveBeenCalledWith('Beneficio alterado com sucesso!');
        expect(component.onConfirm.emit).toHaveBeenCalled();
    });

    it('deve exibir mensagem de erro quando serviço retornar erro', () => {
        beneficioServiceSpy.adicionar.and.returnValue(throwError(() => ({ mensagem: 'Erro ao cadastrar' })));

        component.data = null!;
        component.formData.setValue({ nome: 'Novo', descricao: 'Teste', valor: 100, ativo: true });

        component.onConfirmRegister();

        expect(messageUtilSpy.error).toHaveBeenCalledWith('Erro ao cadastrar');
    });

    it('deve marcar submitted como true e não enviar se form inválido', () => {
        component.formData.setValue({ nome: '', descricao: '', valor: 0, ativo: true });

        component.onConfirmRegister();

        expect(component.submitted).toBeTrue();
        expect(beneficioServiceSpy.adicionar).not.toHaveBeenCalled();
    });

    it('isInvalid deve retornar true para campos inválidos após submit', () => {
        component.formData.get('nome')?.setValue('');
        component.submitted = true;

        const invalid = component.isInvalid('nome');
        expect(invalid).toBeTrue();
    });
});
