import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { BeneficioService } from '@/core/beneficio.service';
import { MessageUtil } from '@/shared/utils/message.util';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Page } from '@/shared/classes/page';
import { Beneficio } from '@/shared/models/beneficio';

describe('HomeComponent', () => {
    let component: HomeComponent;
    let fixture: ComponentFixture<HomeComponent>;
    let beneficioService: jasmine.SpyObj<BeneficioService>;
    let messageUtil: jasmine.SpyObj<MessageUtil>;
    let router: jasmine.SpyObj<Router>;

    const mockPage: Page<Beneficio> = {
        number: 0,
        size: 10,
        totalElements: 1,
        content: [
            {
                id: 1,
                nome: 'Benefício Teste',
                descricao: 'Descrição de teste',
                valor: 150,
                ativo: true,
                version: 0
            }
        ]
    };

    beforeEach(async () => {
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        const beneficioSpy = jasmine.createSpyObj('BeneficioService', ['listarPaginado']);
        const messageSpy = jasmine.createSpyObj('MessageUtil', ['error']);

        await TestBed.configureTestingModule({
            imports: [HomeComponent],
            providers: [
                { provide: BeneficioService, useValue: beneficioSpy },
                { provide: MessageUtil, useValue: messageSpy },
                { provide: Router, useValue: routerSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(HomeComponent);
        component = fixture.componentInstance;
        beneficioService = TestBed.inject(BeneficioService) as jasmine.SpyObj<BeneficioService>;
        messageUtil = TestBed.inject(MessageUtil) as jasmine.SpyObj<MessageUtil>;
        router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

        beneficioService.listarPaginado.and.returnValue(of(mockPage));

        component.ngOnInit();

        beneficioService.listarPaginado.calls.reset();
        messageUtil.error.calls.reset();
        router.navigate.calls.reset();
    });

    afterEach(() => {
        fixture.destroy();
    });

    it('deve criar o componente', () => {
        expect(component).toBeTruthy();
    });

    it('deve carregar os benefícios no ngOnInit', () => {
        beneficioService.listarPaginado.and.returnValue(of(mockPage));
        component['getBeneficioRequest'](false);

        expect(beneficioService.listarPaginado).toHaveBeenCalledTimes(1);
        expect(component.page.content.length).toBe(1);
        expect(component.loading).toBeFalse();
    });

    it('deve tratar erro ao buscar benefícios', () => {
        const mockError = { error: { mensagem: 'Erro ao buscar benefícios' } };
        beneficioService.listarPaginado.and.returnValue(throwError(() => mockError));

        component['getBeneficioRequest'](false);

        expect(beneficioService.listarPaginado).toHaveBeenCalledTimes(1);
        expect(messageUtil.error).toHaveBeenCalledWith('Erro ao buscar benefícios');
    });

    it('deve abrir o diálogo de transferência', () => {
        const beneficio = mockPage.content[0];
        component.handleTransferDialog(beneficio);

        expect(component.transferVisible).toBeTrue();
        expect(component.transferData).toEqual(beneficio);
    });

    it('deve navegar para detalhes do benefício', () => {
        const beneficio = mockPage.content[0];
        component.handleDetailBeneficio(beneficio);

        expect(router.navigate).toHaveBeenCalledWith(['/crud/beneficio'], { state: { data: beneficio } });
    });

    it('deve ocultar diálogo e recarregar lista ao confirmar transferência', () => {
        beneficioService.listarPaginado.and.returnValue(of(mockPage));
        component.transferVisible = true;

        component.handleOnConfirmation();

        expect(component.transferVisible).toBeFalse();
        expect(beneficioService.listarPaginado).toHaveBeenCalledTimes(1);
    });

    it('deve alterar página e buscar novos dados ao mudar de página', fakeAsync(() => {
        beneficioService.listarPaginado.and.returnValue(of(mockPage));

        const event = { first: 10, rows: 10, page: 1, pageCount: 2 };
        component.handlePageChange(event);

        tick();

        expect(component.page.number).toBe(1);
        expect(component.page.size).toBe(10);
        expect(beneficioService.listarPaginado).toHaveBeenCalledTimes(1);
    }));

    it('deve filtrar benefícios ao digitar no campo de busca (debounce)', fakeAsync(() => {
        beneficioService.listarPaginado.and.returnValue(of(mockPage));

        component.globalSearch = 'Teste';
        component.filterSubject$.next('Teste');

        tick(499);
        expect(beneficioService.listarPaginado).not.toHaveBeenCalled();

        tick(1);
        expect(beneficioService.listarPaginado).toHaveBeenCalledTimes(1);
    }));
});
