package renderWindow.gameObjects;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.event.KeyEvent;
import java.awt.event.MouseEvent;
import java.text.AttributedCharacterIterator;

public class GameObject implements Render{
	//position x and y and width and height
	private int PosX;
	private int PosY;
	private int ObjW;
	private int ObjH;
	//name/title of object
	public String title;
	//script attached to object
	private Script script;
	//variables for drawing shape and color of object
	private drawables drawing = drawables.Rect;
	private Color color = Color.white;
	
	
	public GameObject(String tit, int x, int y, int w, int h) {
		title = tit;
		setDimension(x,y,w,h);
		start();
	}
	
	public GameObject(int x, int y, int w) {
		setDimension(x,y,w,w);
		start();
	}
	
	public GameObject(int x, int y) {
		setDimension(x,y,0,0);
		start();
	}
	
	public void start() {
		if(script!=null) script.start(this);
	}
	
	
	
	
	//Drawing Methods
	public void draw(Graphics pen) {
		drawBody(pen);
	}
	
	//draws body of object whether its a a blue square or red circle
	public void drawBody(Graphics pen) {
		drawColor(pen);
		if(drawing == drawables.Rect) {drawRect(pen);}
		else if (drawing == drawables.Oval) {drawOval(pen);}
	}
	
	//draws rectangle of objects width and height
	public void drawRect(Graphics pen) {
		pen.fillRect(getDrawX(), getDrawY(), getObjW(), getObjH());
	}
	
	public void drawBorderRect(Graphics pen) {
		pen.drawRect(getDrawX(), getDrawY(), getObjW(), getObjH());
	}
	
	//draws oval of objects width and height
	public void drawOval(Graphics pen) {
		pen.fillOval(getDrawX(), getDrawY(), getObjW(), getObjH());
	}
	//draws Text at x,y
	public void drawText(Graphics pen, String draw, String strfont, int font, int size) {
		pen.setFont(new Font(strfont, font, size));
		pen.drawString(draw, getDrawX(), getDrawY() + size);
	}
	
	public void drawText(Graphics pen, String draw) {
		drawText(pen,draw,"TimesRoman", Font.PLAIN, 25);
	}
	
	//sets the color on the pen to draw shape
	public void drawColor(Graphics pen) {
		pen.setColor(color);
	}
	
	
	//Updating Methods
	public void update() {
		if(script!=null) script.update();
	}
	
	
	public String toString() {
		String ret = title + "\n";
		return ret;
	}
	
	public void setDimension(int x, int y, int w, int h) {
		setPosX(x);
		setPosY(y);
		setObjW(w);
		setObjH(h);
	}
	public int getPosX() {
		return PosX;
	}
	public int getDrawX() {
		return PosX - (int) (getObjW()/2);
	}
	public void setPosX(int posX) {
		PosX = posX;
	}
	public int getPosY() {
		return PosY;
	}
	public int getDrawY() {
		return PosY - (int) (getObjH()/2);
	}
	public void setPosY(int posY) {
		PosY = posY;
	}
	public int getObjW() {
		return ObjW;
	}
	public void setObjW(int objW) {
		ObjW = objW;
	}
	public int getObjH() {
		return ObjH;
	}
	public void setObjH(int objH) {
		ObjH = objH;
	}

	public Script getScript() {
		return script;
	}

	public void setScript(Script script) {
		this.script = script;
		start();
	}

	public drawables getDrawing() {
		return drawing;
	}

	public void setDrawing(drawables drawing) {
		this.drawing = drawing;
	}
	
	public void setColor(int r, int g, int b) {
		color = new Color(r,g,b);
	}
	public void setColor(Color c) {
		color = c;
	}

	@Override
	public void mouseClicked(MouseEvent e) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void mousePressed(MouseEvent e) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void mouseReleased(MouseEvent e) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void mouseEntered(MouseEvent e) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void mouseExited(MouseEvent e) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void keyTyped(KeyEvent e) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void keyPressed(KeyEvent e) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void keyReleased(KeyEvent e) {
		// TODO Auto-generated method stub
		
	}
}
