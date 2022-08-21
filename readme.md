# withavatar

## 구현된 기능
### 1. Exporter (2022.08.13-2022.08.14)
  - glb로만 출력.
  
### 2. WireFrame (2022.08.14-2022.08.14)
  - MeshBasicMaterial로 해결.
  
### 3. Bone & Mesh 구별 (2022.08.14-2022.08.14)
  - threeJS Model 구성요소의 type으로 구별.

### 4. ShapeKey 출력 (2022.08.13-2022.08.14)
  - threeJS Model geometry의 morphTarget 변수로 출력. 

### 5. TransformControls 추가 (2022.08.15-2022.08.15)
  - 모델 카메라 위치 조정 툴.
  - 자동으로 카메라 위치 조정이 되지 않을 때, 사용.
  
### 6. JSZip 활용 (2022.08.15-2022.08.15)
  - glb 파일 용량이 크기 때문에 압축파일 이용.
  - 단순히 glb 파일 뿐만이 아니라 다른 파일도 압축해야 하기 때문에 사용.

### 7. ZIP 파일 해제 후, 다시 파일 URL로 만들기 (2022.08.16-2022.08-17)
  - 해제 후, 파일의 blob 데이터를 활용해 URL로 활용.

### 8. Vue로 Viewer에 필요한 기능 이전 (2022.08.17-2022.08.18)
  - TroisJS 라이브러리를 활용.
  - Zip 해제 후, URL 활용, ShapeKey 출력 함수 이전.
  
### 9. 모델 정보인 Vertex, Triangle 정보 추출 (2022.08.18-2022.08.18)
  - Renderer를 활용해 추출 완료.

### 10. Wireframe 보기 및 Skeleton 보기 (2022.08.21-2022.08.21)
  - Mesh Material 교체 함수 추가.
  - SkeletonHelper 함수 추가.
  
### 11. Firebase 자동 배포 설정 완료 (2022.08.21-2022.08.21)
  - Firebase 호스팅 서비스 연결 완료.
  - 커스텀 도메인 연결 완료 [Demo](https://demo.withavatar.shop)

### 12. .mp4 비디오 빌드 완료 (2022.08.21-2022.08.21)
  - vite.config 파일 assetsInclude 설정 완료.
