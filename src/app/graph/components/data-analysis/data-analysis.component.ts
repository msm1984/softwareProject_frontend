import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Data, DataSet, Edge, Network, Node } from 'vis';
import { LoadGraphService } from '../../services/load-graph/load-graph.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { ThemeService } from '../../../shared/services/theme.service';
import { getOptions, getSvg } from './graph-options';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { InfoDialogComponent } from './info-dialog/info-dialog.component';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { LoadingService } from '../../../shared/services/loading.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DangerSuccessNotificationComponent } from '../../../shared/components/danger-success-notification/danger-success-notification.component';
import { ColorPickerDialogComponent } from './color-picker-dialog/color-picker-dialog.component';
import { Account } from '../../model/graph';

@Component({
  selector: 'app-data-analysis',
  templateUrl: './data-analysis.component.html',
  styleUrl: './data-analysis.component.scss',
  animations: [
    trigger('sidebar-fly', [
      state('startRound', style({ transform: 'translateX(0)' })),
      state('endRound', style({ transform: 'translateX(120%)' })),
      transition('* <=> *', [animate('500ms ease-in-out')]),
    ]),
    trigger('main-expand', [
      state('startRound', style({ width: 'calc(100% - 26rem)' })),
      state('endRound', style({ width: '100%' })),
      transition('* <=> *', [animate('500ms ease-in-out')]),
    ]),
  ],
})
export class DataAnalysisComponent implements AfterViewInit {
  @ViewChild(MatMenuTrigger, { static: true }) matMenuTrigger!: MatMenuTrigger;
  @ViewChild('menuTrigger', { read: ElementRef }) menuTrigger!: ElementRef;
  @ViewChild('network', { static: true }) el!: ElementRef;

  private networkInstance!: Network;
  public state = 'startRound';

  isDarkMode = false;
  nodeColor!: string;
  selectedNodeColor!: string;
  isNode!: boolean;

  nodes = new DataSet<Node>([] as unknown as Node[]);
  edges = new DataSet<Edge>([] as Edge[]);
  data: Data = { nodes: this.nodes, edges: this.edges };
  selectedNodes = new Set<number>();

  constructor(
    private themeService: ThemeService,
    private _snackBar: MatSnackBar,
    private loadGraphService: LoadGraphService,
    private dialog: MatDialog,
    private changeDetector: ChangeDetectorRef,
    private loadingService: LoadingService
  ) {}

  ngAfterViewInit() {
    this.createGraph();
    this.themeService.theme$.subscribe((theme) => {
      this.isDarkMode = theme == 'dark';
      this.nodeColor = this.isDarkMode ? '#b5c4ff' : 'rgb(27, 89, 248)';
      this.selectedNodeColor = this.isDarkMode ? 'rgb(27, 89, 248)' : '#b5c4ff';
    });
  }

  private createGraph() {
    this.networkInstance = new Network(
      this.el.nativeElement,
      this.data,
      getOptions()
    );

    // Listen for the context menu event (right-click)
    this.networkInstance.on('oncontext', (params) => {
      params.event.preventDefault();

      const nodeId = this.networkInstance.getNodeAt(params.pointer.DOM);
      const edgeId = this.networkInstance.getEdgeAt(params.pointer.DOM);

      if (nodeId !== undefined) {
        this.isNode = true;
        this.menuTrigger.nativeElement.style.left = params.event.clientX + 'px';
        this.menuTrigger.nativeElement.style.top = params.event.clientY + 'px';
        this.menuTrigger.nativeElement.style.position = 'fixed';
        this.matMenuTrigger.openMenu();

        this.changeDetector.detectChanges();
        const rightClickNodeInfoElem = document.getElementById(
          'right-click-node-info'
        ) as HTMLElement;

        rightClickNodeInfoElem.dataset['nodeid'] = nodeId.toString();
      } else if (edgeId !== undefined) {
        this.isNode = false;
        console.log('Right-clicked edge:', edgeId);
        this.menuTrigger.nativeElement.style.left = params.event.clientX + 'px';
        this.menuTrigger.nativeElement.style.top = params.event.clientY + 'px';
        this.menuTrigger.nativeElement.style.position = 'fixed';
        this.matMenuTrigger.openMenu();

        this.changeDetector.detectChanges();
        const rightClickNodeInfoElem = document.getElementById(
          'right-click-node-info'
        ) as HTMLElement;

        rightClickNodeInfoElem.dataset['edgeid'] = edgeId.toString();
      }
    });

    this.networkInstance.on('click', (params) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];

        if (params.event.srcEvent.ctrlKey || params.event.srcEvent.metaKey) {
          this.toggleNodeSelection(nodeId);
        } else {
          this.handleSingleClick(nodeId);
        }

        console.log(this.selectedNodes);
      } else if (params.edges.length === 1) {
        this.handleEdgeClick(params.edges[0]);
      } else {
        this.clearAllSelections();
      }
    });
  }

  toggleNodeSelection(nodeId: number): void {
    if (this.selectedNodes.has(nodeId)) {
      this.deselectNode(nodeId);
    } else {
      this.selectNode(nodeId);
    }
  }

  handleSingleClick(nodeId: number): void {
    if (this.selectedNodes.has(nodeId)) {
      this.deselectNode(nodeId);
    } else {
      this.clearAllSelections();
      this.selectNode(nodeId);
    }
  }

  selectNode(nodeId: number): void {
    this.selectedNodes.add(nodeId);
    this.nodes.update({
      id: nodeId,
      image: getSvg(this.selectedNodeColor),
    });
  }

  deselectNode(nodeId: number): void {
    this.selectedNodes.delete(nodeId);
    this.nodes.update({
      id: nodeId,
      image: getSvg(this.nodeColor),
    });
  }

  clearAllSelections(): void {
    this.selectedNodes.forEach((selectedNodeId) => {
      this.nodes.update({
        id: selectedNodeId,
        image: getSvg(this.nodeColor),
      });
    });
    this.selectedNodes.clear();
  }

  handleEdgeClick(edgeId: number): void {
    console.log('edge click: ', edgeId);
  }

  getNodeInfo() {
    const account = (
      document.getElementById('right-click-node-info') as HTMLElement
    ).dataset['nodeid'];

    this.loadGraphService.getNodeInfo(account!).subscribe({
      next: (data) => {
        this.dialog.open(InfoDialogComponent, {
          width: '105rem',
          data,
        });
        this.loadingService.setLoading(false);
      },
      error: (error) => {
        this._snackBar.openFromComponent(DangerSuccessNotificationComponent, {
          data: error.error.message,
          panelClass: ['notification-class-danger'],
          duration: 2000,
        });
        this.loadingService.setLoading(false);
      },
    });
  }

  getEdgeInfo() {
    const account = (
      document.getElementById('right-click-node-info') as HTMLElement
    ).dataset['edgeid'];

    this.loadGraphService.getEdgeInfo(account!).subscribe({
      next: (data) => {
        this.dialog.open(InfoDialogComponent, {
          width: '105rem',
          data,
        });
        this.loadingService.setLoading(false);
      },
      error: (error) => {
        this._snackBar.openFromComponent(DangerSuccessNotificationComponent, {
          data: error.error.message,
          panelClass: ['notification-class-danger'],
          duration: 2000,
        });
        this.loadingService.setLoading(false);
      },
    });
  }

  showAsGraph(account: Account) {
    this.nodes.add({ id: account.id, label: account.entityName });
  }

  getGraph() {
    const nodeId = (
      document.getElementById('right-click-node-info') as HTMLElement
    ).dataset['nodeid'];

    this.loadGraphService.getGraph(nodeId!).subscribe({
      next: (data) => {
        data.nodes.forEach((newNode: Node) => {
          if (!this.nodes.get().find((n) => n.id == newNode.id)) {
            this.nodes.add(newNode);
          }
        });
        data.edges.forEach((newEdge: Edge) => {
          if (!this.edges.get().find((e) => e.id == newEdge.id)) {
            this.edges.add(newEdge);
          }
        });
        this.loadingService.setLoading(false);
      },
      error: (error) => {
        this._snackBar.openFromComponent(DangerSuccessNotificationComponent, {
          data: error.error.message,
          panelClass: ['notification-class-danger'],
          duration: 2000,
        });
        this.loadingService.setLoading(false);
      },
    });
  }

  changeState() {
    this.state = this.state == 'startRound' ? 'endRound' : 'startRound';
  }

  closeSearchBar() {
    this.changeState();
  }

  clearGraph() {
    this.nodes.clear();
  }

  openColorDialog(event: MouseEvent) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = {
      top: `${event.clientY + -110}px`,
      left: `${event.clientX + -150}px`,
    };
    dialogConfig.width = '250px';

    const dialogRef = this.dialog.open(
      ColorPickerDialogComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.selectedNodes.size > 0) {
        this.changeNodeColors(result);
      }
    });
  }

  changeNodeColors(color: string) {
    this.selectedNodes.forEach((nodeId) => {
      // Update the node with the new color by generating a new SVG
      this.nodes.update({
        id: nodeId,
        image: getSvg(color), // Generate SVG with the selected color
      });
    });

    // Optionally clear the selection after updating
    this.selectedNodes.clear();
  }
}
