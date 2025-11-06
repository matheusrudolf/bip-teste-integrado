import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { BeneficioService } from "./beneficio.service"
import { Content } from '@/shared/classes/content';
import { Beneficio } from '@/shared/models/beneficio';
import { environment } from 'src/environments/environment.local.ts';
import { Page } from '@/shared/classes/page';

describe('BeneficioService', () => {
    let service: BeneficioService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                BeneficioService,
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });

        service = TestBed.inject(BeneficioService);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('deve listar todos os beneficios', () => {
        const mockResponse: Content<Beneficio> = {
            dados: [
                {
                    id: 1,
                    nome: 'Beneficio Teste',
                    descricao: 'Descricao Teste',
                    valor: 100.00,
                    ativo: true,
                    version: 0
                }
            ],
            sucesso: true,
            mensagem: 'Beneficios consultados com sucesso!'
        };

        service.listarTodos().subscribe(res => {
            expect(res).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/beneficios`);
        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('deve listar beneficios paginados', () => {
        const params = new Map<string, any>([['ativo', true]]);
        const page: Page<Beneficio> = { number: 0, size: 10, totalElements: 1, content: [], };

        const mockResponse: Page<Beneficio> = {
            number: 0,
            size: 10,
            totalElements: 1,
            content: [
                {
                    id: 1,
                    nome: 'Beneficio Teste',
                    descricao: 'Descricao Teste',
                    valor: 500,
                    ativo: true,
                    version: 0
                }
            ]
        };

        service.listarPaginado(params, page).subscribe(res => {
            expect(res).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/beneficios/pageable?ativo=true&size=10&page=0`);

        expect(req.request.method).toBe('GET');
        req.flush(mockResponse);
    });

    it('deve adicionar um beneficio', () => {
        const newBeneficio: Beneficio = {
            id: 2,
            nome: 'Novo Beneficio',
            descricao: 'Nova Descricao',
            valor: 200.00,
            ativo: true,
            version: 0
        };

        const mockResponse: Content<Beneficio> = {
            dados: [newBeneficio],
            sucesso: true,
            mensagem: 'Beneficio inserido com sucesso!'
        };

        service.adicionar(newBeneficio).subscribe(res => {
            expect(res).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/beneficios`);
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(newBeneficio);
        req.flush(mockResponse);
    });

    it('deve atualizar um beneficio existente', () => {
        const updatedBeneficio: Beneficio = {
            id: 1,
            nome: 'Benefício Atualizado',
            descricao: 'Descrição Atualizada',
            valor: 300.0,
            ativo: true,
            version: 1
        };

        const mockResponse: Content<Beneficio> = {
            dados: [updatedBeneficio],
            sucesso: true,
            mensagem: 'Benefício alterado com sucesso!'
        };

        service.atualizar(updatedBeneficio.id, updatedBeneficio).subscribe(res => {
            expect(res).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/beneficios/${updatedBeneficio.id}`);
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual(updatedBeneficio);
        req.flush(mockResponse);
    });


    it('deve remover um beneficio', () => {
        const id = 1;
        const mockResponse: Content<Beneficio> = {
            dados: [],
            sucesso: true,
            mensagem: 'Benefício excluido com sucesso!'
        };

        service.remover(id).subscribe(res => {
            expect(res).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/beneficios/${id}`);
        expect(req.request.method).toBe('DELETE');
        req.flush(mockResponse);
    });

    it('deve transferir valores entre benefícios', () => {
        const params = { fromId: 1, toId: 2, amount: 100 };
        const mockResponse: Content<Beneficio> = {
            dados: [],
            sucesso: true,
            mensagem: 'Transferência executada com sucesso!'
        };

        service.transfer(params).subscribe(res => {
            expect(res).toEqual(mockResponse);
        });

        const req = httpMock.expectOne(
            `${environment.apiUrl}/api/v1/beneficios/transfer?fromId=1&toId=2&amount=100`
        );
        expect(req.request.method).toBe('PUT');
        req.flush(mockResponse);
    });
});
