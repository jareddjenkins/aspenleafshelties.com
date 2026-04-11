import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { filter } from 'rxjs/operators';

import { FooterComponent } from './footer/footer.component';
import { TopnavComponent } from './topnav/topnav.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterOutlet, TopnavComponent, FooterComponent],
  standalone: true,
})
export class AppComponent implements OnInit {
  private readonly siteName = 'Aspenleaf Shelties';
  private readonly siteUrl = 'https://aspenleafshelties.com';
  private readonly defaultSocialImage = `${this.siteUrl}/assets/images/aspenleafshelties.png`;
  isAdminRoute = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isAdminRoute = this.router.url.startsWith('/admin');
        this.updateSeoTags();
      });

    this.isAdminRoute = this.router.url.startsWith('/admin');
  }

  ngOnInit(): void {
    this.updateSeoTags();
  }

  private updateSeoTags() {
    let route = this.activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }

    const data = route.pathFromRoot.reduce(
      (mergedData, currentRoute) => ({ ...mergedData, ...currentRoute.snapshot.data }),
      {},
    );
    const title = data['title'] || this.siteName;
    const description =
      data['description'] ||
      'Aspenleaf Shelties is a small Shetland Sheepdog breeder in Dewy Rose, Georgia.';
    const robots = data['robots'] || 'index, follow';
    const rawUrl = new URL(this.router.url, this.siteUrl);
    rawUrl.search = '';
    rawUrl.hash = '';
    const url = rawUrl.toString();

    this.titleService.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'robots', content: robots });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: this.siteName });
    this.meta.updateTag({ property: 'og:image', content: this.defaultSocialImage });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: this.defaultSocialImage });
    this.upsertCanonical(url);
  }

  private upsertCanonical(url: string) {
    let canonical = this.document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = this.document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      this.document.head.appendChild(canonical);
    }

    canonical.setAttribute('href', url);
  }
}
