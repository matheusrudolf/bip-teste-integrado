import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BeneficioComponent } from './beneficio.component';
import { BeneficioService } from '@/core/beneficio.service';
import { MessageUtil } from '@/shared/utils/message.util';
import { Confirmation, ConfirmationService } from 'primeng/api';
import { CurrencyPipe } from '@angular/common';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Page } from '@/shared/classes/page';
import { Beneficio } from '@/shared/models/beneficio';

describe('BeneficioComponent', () => {
    let component: BeneficioComponent;
    let fixture: ComponentFixture<BeneficioComponent>;
    let beneficioService: jasmine.SpyObj<BeneficioService>;
    let messageUtil: jasmine.SpyObj<MessageUtil>;
    let confirmService: jasmine.SpyObj<ConfirmationService>;
    let router: jasmine.SpyObj<Router>;

    const mockPage: Page<Beneficio> = {
        content: [{ id: 1, nome: 'Teste', descricao: 'Desc', valor: 500, ativo: true, version: 1 }],
        totalElements: 1,
        totalPages: 1,
        size: 10,
        number: 0
    } as Page<Beneficio>;

    beforeEach(async () => {
        const beneficioSpy = jasmine.createSpyObj('BeneficioService', ['listarPaginado', 'remover']);
        const messageSpy = jasmine.createSpyObj('MessageUtil', ['success', 'error']);
        const confirmSpy = jasmine.createSpyObj('ConfirmationService', ['confirm']);
        const routerSpy = jasmine.createSpyObj('Router', ['getCurrentNavigation']);

        await TestBed.configureTestingModule({
            imports: [BeneficioComponent],
            providers: [
                { provide: BeneficioService, useValue: beneficioSpy },
                { provide: MessageUtil, useValue: messageSpy },
                { provide: ConfirmationService, useValue: confirmSpy },
                { provide: Router, useValue: routerSpy },
                CurrencyPipe
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(BeneficioComponent);
        component = fixture.componentInstance;
        beneficioService = TestBed.inject(BeneficioService) as jasmine.SpyObj<BeneficioService>;
        messageUtil = TestBed.inject(MessageUtil) as jasmine.SpyObj<MessageUtil>;
        confirmService = TestBed.inject(ConfirmationService) as jasmine.SpyObj<ConfirmationService>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    it('deve chamar getBeneficioRequest no ngOnInit', fakeAsync(() => {
        const spy = spyOn(component, 'getBeneficioRequest');
        component.ngOnInit();
        tick();
        expect(spy).toHaveBeenCalledWith(false);
    }));

    it('deve chamar listarPaginado e atualizar a página', fakeAsync(() => {
        beneficioService.listarPaginado.and.returnValue(of(mockPage));

        component.getBeneficioRequest(false);
        tick();

        expect(beneficioService.listarPaginado).toHaveBeenCalled();
        expect(component.page.content.length).toBe(1);
        expect(component.loading).toBeFalse();
    }));

    it('deve tratar erro ao listar benefícios', fakeAsync(() => {
        const mockError = { error: { mensagem: 'Erro ao carregar' } };
        beneficioService.listarPaginado.and.returnValue(throwError(() => mockError));

        component.getBeneficioRequest(false);
        tick();

        expect(messageUtil.error).toHaveBeenCalledWith('Erro ao carregar');
    }));

    it('deve abrir o registro corretamente com handleOpenRegister', () => {
        const mockData = { id: 1, nome: 'Teste' } as Beneficio;
        component.handleOpenRegister('edit', mockData);

        expect(component.registerVisible).toBeTrue();
        expect(component.registerState).toBe('edit');
        expect(component.registerData).toBe(mockData);
    });

    it('deve chamar confirmService.confirm ao excluir benefício', () => {
        confirmService.confirm.and.callFake((conf: Confirmation) => {
            expect(conf.message).toContain('Deseja remover');
            return confirmService;
        });

        component.handleDeleteBeneficio(1);

        expect(confirmService.confirm).toHaveBeenCalled();
    });

    it('deve tratar erro ao excluir benefício', () => {
        const mockError = { error: { mensagem: 'Falha ao excluir' } };
        confirmService.confirm.and.callFake((conf) => conf.accept && conf.accept());
        beneficioService.remover.and.returnValue(throwError(() => mockError));

        component.handleDeleteBeneficio(2);

        expect(messageUtil.error).toHaveBeenCalledWith('Falha ao excluir');
    });

    it('deve limpar filtros corretamente', fakeAsync(() => {
        const spy = spyOn(component, 'getBeneficioRequest');
        component.filtrosForm.patchValue({
            nome: 'abc',
            descricao: 'desc',
            valor: 200,
            ativo: false
        });

        component.handleClearFiltros();
        tick();

        expect(component.filtrosForm.value).toEqual({
            nome: '',
            descricao: '',
            valor: 0.00,
            ativo: true
        });
        expect(spy).toHaveBeenCalledWith(true);
    }));

    it('deve atualizar paginação corretamente', fakeAsync(() => {
        const spy = spyOn(component, 'getBeneficioRequest');
        component.handlePageChange({ page: 2, rows: 15 });
        tick();
        expect(component.page.number).toBe(2);
        expect(component.page.size).toBe(15);
        expect(spy).toHaveBeenCalledWith(false);
    }));

    it('deve recarregar lista ao confirmar cadastro', fakeAsync(() => {
        const spy = spyOn(component, 'getBeneficioRequest');
        component.handleOnConfirmation();
        tick();
        expect(component.registerVisible).toBeFalse();
        expect(spy).toHaveBeenCalledWith(false);
    }));
});
