---
sh: sed -i "<%= lastLine %>i\\\n" "apps/server/src/app/<%= kebab %>/<%= kebab %>.service.ts" 
    && sed -i "<%= methodLineNumber %>i\\\n" "apps/server/src/app/<%= kebab %>/<%=kebab %>.controller.ts"
---