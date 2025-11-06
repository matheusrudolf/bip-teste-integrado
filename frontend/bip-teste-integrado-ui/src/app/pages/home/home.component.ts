import { BeneficioService } from '@/core/beneficio.service';
import { Beneficio } from '@/shared/models/beneficio';
import { Component, inject, OnInit } from '@angular/core';
import { debounceTime, finalize, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Page } from '@/shared/classes/page';
import { HOME_IMPORTS } from './imports';
import { PaginatorState } from 'primeng/paginator';
import { MessageUtil } from '@/shared/utils/message.util';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: HOME_IMPORTS,
    template: `
        <div class="card shadow-md">
            <h2 class="text-center">Consulta de Benefícios</h2>
            <h4 class="text-center text-slate-400">confira abaixo nos cards os benefícios disponíveis no momento</h4>

            <div class="card border-1 border-gray-200 dark:border-gray-700 mb-4 mt-4">
                <P class="text-slate-400">Ou busque um benefício em especfico</P>
                <p-iconfield>
                    <p-inputicon class="pi pi-search" />
                    <input pInputText type="text" [(ngModel)]="globalSearch" placeholder="Buscar por nome, descrição..."
                        (ngModelChange)="filterSubject$.next(globalSearch)" fluid />
                </p-iconfield>
            </div>

            @if (loading) {
                <div class="card flex flex-col justify-center items-center gap-3 mt-8">
                    <p-progress-spinner strokeWidth="6" fill="transparent"
                        animationDuration=".5s"[style]="{ width: '3rem', height: '3rem' }">
                    </p-progress-spinner>

                    <h4 class="text-gray-600 font-medium">Carregando...</h4>
                </div>
            } @else {
                <div class="flex flex-wrap gap-4">
                    @for (data of page.content; track $index) {
                        <div class="card card-animation border-1 border-gray-200 dark:border-gray-700 shadow-sm p-4 flex-1 min-w-[280px]">
                            <div class="flex justify-between">
                                <h5> {{data.nome}} </h5>
                                <p-button icon="pi pi-arrow-right-arrow-left" severity="secondary" pTooltip="Transferir Saldo"
                                    (onClick)="handleTransferDialog(data)" [disabled]="!data.ativo" />
                            </div>
                            <div class="flex justify-center">
                                <small class="text-slate-400">Saldo</small>
                            </div>
                            <h2 class="text-center">
                                {{ data.valor | currency : 'BRL' }}
                            </h2>
                            <div class="flex justify-between">
                                <p class="text-slate-400"> {{ data.descricao }} </p>
                                <p>Status: <p-badge [value]="data.ativo ? 'Ativo' : 'Inativo'"
                                    [severity]="data.ativo ? 'success' : 'danger'" />
                                </p>
                            </div>
                            <div class="flex gap-4 mt-4">
                                <button pButton label="Obter Beneficio" severity="secondary" outlined fluid></button>
                                <button pButton label="Detalhes" severity="info" fluid (click)="handleDetailBeneficio(data)">
                                </button>
                            </div>
                        </div>
                    }
                </div>

                <p-paginator [rows]="page.size" [first]="page.number * page.size" [totalRecords]="page.totalElements"
                    [rowsPerPageOptions]="[5,10,15,20]" (onPageChange)="handlePageChange($event)"
                    class="mt-5" />
            }

            @if (page.content.length === 0) {
                <div class="flex justify-center mt-8">
                    <h2 class="text-slate-400 font-bold">Nenhum resultado encontrado</h2>
                </div>
            }
        </div>

        <app-beneficio-transfer [visible]="transferVisible" [data]="transferData"
            [options]="beneficiosOptions" (onClose)="transferVisible = false"
            (onConfirm)="handleOnConfirmation()" />
    `
})
export class HomeComponent implements OnInit {
    private readonly beneficioService = inject(BeneficioService);
    private readonly messageUtil = inject(MessageUtil);
    public readonly router = inject(Router);

    public page: Page<Beneficio> = new Page<Beneficio>;
    public loading: boolean = true;
    public transferVisible: boolean = false;
    public transferData!: Beneficio;
    public globalSearch: string = '';

    public beneficiosOptions: any[] = [];

    public filterSubject$ = new Subject<any>();

    constructor() {
        this.filterSubject$.pipe(debounceTime(500)).subscribe(() => this.getBeneficioRequest(true));
    }

    ngOnInit(): void {
        this.getBeneficioRequest(false);
    }

    private getBeneficioRequest(filter: boolean): void {
        this.loading = true;

        const params = new Map<string, any>();

        params.set('ativo', true);

        if (filter && this.globalSearch && this.globalSearch !== '') params.set('search', this.globalSearch);

        this.beneficioService.listarPaginado(params, this.page)
            .pipe(finalize(() => this.loading = false))
            .subscribe(({
                next: (res: Page<Beneficio>) => {
                    this.page = res;
                    this.beneficiosOptions = this.page.content.map(data => ({ label: data.nome, id: data.id }));
                },
                error: (err) => this.messageUtil.error(err.error.mensagem)
            }));
    }

    public handleTransferDialog(data: Beneficio): void {
        this.transferVisible = true;
        this.transferData = data;
    }

    public handleDetailBeneficio(data: Beneficio): void {
        this.router.navigate(['/crud/beneficio'], { state: { data: data } });
    }

    public handleOnConfirmation(): void {
        this.transferVisible = false;
        this.getBeneficioRequest(false);
    }

    public handlePageChange(event: PaginatorState): void {
        this.page.number = event.page ?? 0;
        this.page.size = event.rows ?? 0;
        this.getBeneficioRequest(false);
    }
}
