export const VERTEX_SRC = `
void main() { gl_Position = vec4(position, 1.0); }
`;

export const SHAPE_MAP: Record<string, number> = {
  square: 0, circle: 1, triangle: 2, diamond: 3,
};

export const MAX_CLICKS = 10;

export const FRAGMENT_SRC = `
precision highp float;
uniform vec3  uColor; uniform vec2 uResolution; uniform float uTime;
uniform float uPixelSize; uniform float uScale; uniform float uDensity;
uniform float uPixelJitter; uniform int uEnableRipples; uniform float uRippleSpeed;
uniform float uRippleThickness; uniform float uRippleIntensity; uniform float uEdgeFade;
uniform int uShapeType;
const int SHAPE_SQUARE=0; const int SHAPE_CIRCLE=1; const int SHAPE_TRIANGLE=2; const int SHAPE_DIAMOND=3;
const int MAX_CLICKS=10;
uniform vec2 uClickPos[MAX_CLICKS]; uniform float uClickTimes[MAX_CLICKS];
out vec4 fragColor;

float Bayer2(vec2 a){a=floor(a);return fract(a.x/2.+a.y*a.y*.75);}
#define Bayer4(a) (Bayer2(.5*(a))*0.25+Bayer2(a))
#define Bayer8(a) (Bayer4(.5*(a))*0.25+Bayer2(a))
float hash11(float n){return fract(sin(n)*43758.5453);}

float vnoise(vec3 p){
  vec3 ip=floor(p); vec3 fp=fract(p);
  float n000=hash11(dot(ip+vec3(0,0,0),vec3(1,57,113))); float n100=hash11(dot(ip+vec3(1,0,0),vec3(1,57,113)));
  float n010=hash11(dot(ip+vec3(0,1,0),vec3(1,57,113))); float n110=hash11(dot(ip+vec3(1,1,0),vec3(1,57,113)));
  float n001=hash11(dot(ip+vec3(0,0,1),vec3(1,57,113))); float n101=hash11(dot(ip+vec3(1,0,1),vec3(1,57,113)));
  float n011=hash11(dot(ip+vec3(0,1,1),vec3(1,57,113))); float n111=hash11(dot(ip+vec3(1,1,1),vec3(1,57,113)));
  vec3 w=fp*fp*fp*(fp*(fp*6.-15.)+10.);
  return mix(mix(mix(n000,n100,w.x),mix(n010,n110,w.x),w.y),mix(mix(n001,n101,w.x),mix(n011,n111,w.x),w.y),w.z)*2.-1.;
}

float fbm2(vec2 uv,float t){
  vec3 p=vec3(uv*uScale,t); float amp=1.; float freq=1.; float s=1.;
  for(int i=0;i<5;++i){s+=amp*vnoise(p*freq);freq*=1.25;amp*=1.;}
  return s*0.5+0.5;
}

float maskCircle(vec2 p,float cov){float r=sqrt(cov)*.25;float d=length(p-0.5)-r;float aa=0.5*fwidth(d);return cov*(1.-smoothstep(-aa,aa,d*2.));}
float maskTriangle(vec2 p,vec2 id,float cov){bool fl=mod(id.x+id.y,2.)>0.5;if(fl)p.x=1.-p.x;float r=sqrt(cov);float d=p.y-r*(1.-p.x);float aa=fwidth(d);return cov*clamp(0.5-d/aa,0.,1.);}
float maskDiamond(vec2 p,float cov){float r=sqrt(cov)*0.564;return step(abs(p.x-0.49)+abs(p.y-0.49),r);}

void main(){
  vec2 fragCoord=gl_FragCoord.xy-uResolution*.5;
  float ar=uResolution.x/uResolution.y;
  vec2 pixelId=floor(fragCoord/uPixelSize); vec2 pixelUV=fract(fragCoord/uPixelSize);
  float cps=8.*uPixelSize; vec2 cellId=floor(fragCoord/cps);
  vec2 uv=cellId*cps/uResolution*vec2(ar,1.);
  float base=fbm2(uv,uTime*.05)*.5-.65;
  float feed=base+(uDensity-.5)*.3;
  if(uEnableRipples==1){
    for(int i=0;i<MAX_CLICKS;++i){
      vec2 pos=uClickPos[i]; if(pos.x<0.)continue;
      vec2 cuv=((pos-uResolution*.5-cps*.5)/uResolution)*vec2(ar,1.);
      float t=max(uTime-uClickTimes[i],0.);
      float r=distance(uv,cuv);
      float ring=exp(-pow((r-uRippleSpeed*t)/uRippleThickness,2.));
      feed=max(feed,ring*exp(-t)*exp(-10.*r)*uRippleIntensity);
    }
  }
  float bayer=Bayer8(fragCoord/uPixelSize)-.5;
  float bw=step(0.5,feed+bayer);
  float h2=fract(sin(dot(floor(fragCoord/uPixelSize),vec2(127.1,311.7)))*43758.5453);
  float cov=bw*(1.+(h2-.5)*uPixelJitter);
  float M;
  if(uShapeType==SHAPE_CIRCLE)M=maskCircle(pixelUV,cov);
  else if(uShapeType==SHAPE_TRIANGLE)M=maskTriangle(pixelUV,pixelId,cov);
  else if(uShapeType==SHAPE_DIAMOND)M=maskDiamond(pixelUV,cov);
  else M=cov;
  if(uEdgeFade>0.){vec2 n2=gl_FragCoord.xy/uResolution;float edge=min(min(n2.x,n2.y),min(1.-n2.x,1.-n2.y));M*=smoothstep(0.,uEdgeFade,edge);}
  vec3 srgb=mix(uColor*12.92,1.055*pow(uColor,vec3(1./2.4))-.055,step(0.0031308,uColor));
  fragColor=vec4(srgb,M);
}
`;
