import { Content } from '@/shared/classes/content';
import { Page } from '@/shared/classes/page';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.local.ts';

@Injectable({
    providedIn: 'root'
})
export abstract class AbstractService<RESPONSE, RESUME> {

    protected readonly http = inject(HttpClient);

    protected abstract get resource(): string;

    public listarTodos(httpParams?: HttpParams): Observable<Content<RESUME>> {
        return this.http.get<Content<RESUME>>(this.endpoint, { params: httpParams });
    }

    public listarPaginado(params: Map<string, any>, page: Page<any>): Observable<Page<RESUME>> {
        let httpParams = new HttpParams();

        if (params) params.forEach((value, key) => httpParams = httpParams.set(key, value));

        if (page.size) httpParams = httpParams.set('size', String(page.size));

        httpParams = httpParams.set('page', String(page.number ?? 0));

        return this.http.get<Page<RESUME>>(`${this.endpoint}/pageable`, { params: httpParams });
    }

    public adicionar(data: any): Observable<Content<RESPONSE>> {
        return this.http.post<Content<RESPONSE>>(this.endpoint, data);
    }

    public atualizar(id: number, data: any): Observable<Content<RESPONSE>> {
        return this.http.put<Content<RESPONSE>>(`${this.endpoint}/${id}`, data);
    }

    public remover(id: number): Observable<Content<RESUME>> {
        return this.http.delete<Content<RESUME>>(`${this.endpoint}/${id}`);
    }

    protected get endpoint(): string {
        return `${environment.apiUrl}/api/v1/${this.resource}`;
    }

}
