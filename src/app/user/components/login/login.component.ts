import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Data, DataSet, Edge, Network, Node } from 'vis';
import { ThemeService } from '../../../shared/services/theme.service';
import { LoadingService } from '../../../shared/services/loading.service';
import { getOptions, GRAPH_EDGES, GRAPH_NODES } from './login-graph';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements AfterViewInit {
  @ViewChild('network') el!: ElementRef;
  private networkInstance!: Network;

  constructor(
    private themeService: ThemeService,
    private loadingService: LoadingService,
  ) {
    this.loadingService.setLoading(false);
  }

  changeTheme() {
    this.themeService.changeThemeState();
    this.themeService.theme$.subscribe((data) => {
      const themeChanger = document.getElementById(
        'theme-changer-icon',
      ) as HTMLElement;
      themeChanger.textContent = data === 'dark' ? 'light_mode' : 'dark_mode';
      this.networkInstance.setOptions({
        nodes: {
          font: {
            color: data === 'dark' ? 'rgba(255,255,255,0.9)' : '#424242',
          },
        },
      });
    });
  }

  ngAfterViewInit() {
    const dataSetValue = document.body.getAttribute('data-theme');
    const labelColor: string =
      dataSetValue == 'dark' ? 'rgba(255,255,255,0.9)' : '#424242';

    const container = this.el.nativeElement;

    this.createGraph(labelColor, container);
  }

  private createGraph(labelColor: string, container: HTMLElement) {
    // create some nodes
    const nodes = new DataSet<Node>(GRAPH_NODES as unknown as Node[]);
    // create some edges
    const edges = new DataSet<Edge>(GRAPH_EDGES as Edge[]);

    const data: Data = { nodes, edges };

    // create a network
    this.networkInstance = new Network(container, data, getOptions(labelColor));

    this.networkInstance.moveTo({
      animation: true,
      scale: 0.1,
    });
  }
}
