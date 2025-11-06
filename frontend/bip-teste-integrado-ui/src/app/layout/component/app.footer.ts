import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `<div class="layout-footer">
        Teste Integrado by
        <a href="https://bipbrasil.com.br/" target="_blank" rel="noopener noreferrer" class="text-primary font-bold hover:underline">BIP</a>
    </div>`
})
export class AppFooter {}
