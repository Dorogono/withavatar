# withavatar

## 구현된 기능
1. Exporter (2022.08.13-2022.08.14)
  - glb로만 출력.
  
2. WireFrame (2022.08.14-2022.08.14)
  - MeshBasicMaterial로 해결.
  
3. Bone & Mesh 구별 (2022.08.14-2022.08.14)
  - threeJS Model 구성요소의 type으로 구별.

4. ShapeKey 출력 (2022.08.13-2022.08.14)
  - threeJS Model geometry의 morphTarget 변수로 출력. 

5. TransformControls 추가 (2022.08.15-2022.08.15)
  - 모델 카메라 위치 조정 툴.
  - 자동으로 카메라 위치 조정이 되지 않을 때, 사용.
  
6. JSZip 활용 (2022.08.15-2022.08.15)
  - glb 파일 용량이 크기 때문에 압축파일 이용.
  - 단순히 glb 파일 뿐만이 아니라 다른 파일도 압축해야 하기 때문에 사용.
