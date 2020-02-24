import ColorCircle from './colorCircle';
import { HSV, RGB } from './colorUtil';

export default class AnyWherePaint {
  private canvas_: HTMLCanvasElement;
  private ctx_: CanvasRenderingContext2D;
  private colorCircle_: ColorCircle | null = null;
  constructor(canvas: HTMLCanvasElement) {
    this.canvas_ = canvas;
    this.ctx_ = <CanvasRenderingContext2D>canvas.getContext('2d');
    this.start();
  }

  private start() {
    const pre: { x: number; y: number } = { x: 0, y: 0 };
    let isDrawing: boolean = false;

    this.ctx_.lineCap = 'round';
    this.ctx_.lineJoin = 'round';
    this.canvas_.addEventListener('mousedown', e => {
      isDrawing = true;
      const rect: DOMRect = this.canvas_.getBoundingClientRect();
      const x: number = e.pageX - rect.left;
      const y: number = e.pageY - rect.top;
      pre.x = x;
      pre.y = y;
      if (this.colorCircle_) {
        const color: HSV | RGB = this.colorCircle_.getColor(true);
        if (color) this.ctx_.strokeStyle = color.toString();
      }
    });
    window.addEventListener('mouseup', e => {
      isDrawing = false;
    });
    window.addEventListener('mousemove', e => {
      if (isDrawing) {
        const rect: DOMRect = this.canvas_.getBoundingClientRect();
        const x: number = e.pageX - rect.left;
        const y: number = e.pageY - rect.top;
        this.drawLine(pre.x, pre.y, x, y);
        pre.x = x;
        pre.y = y;
      }
    });
  }

  /**
   *
   * @param {number} width line width(px)
   */
  public setLineWidth(width: number) {
    this.ctx_.lineWidth = width;
  }

  /**
   * @param {string} color css styled color string
   */
  public setLineColor(color: string) {
    this.ctx_.strokeStyle = color;
  }

  public createColorCircle(div: HTMLDivElement) {
    this.colorCircle_ = new ColorCircle(div);
  }

  private drawLine(
    preX: number,
    preY: number,
    currentX: number,
    currentY: number
  ) {
    this.ctx_.beginPath();
    this.ctx_.moveTo(preX, preY);
    this.ctx_.lineTo(currentX, currentY);
    this.ctx_.stroke();
  }
}
