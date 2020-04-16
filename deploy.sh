VERSION=$(sed -nE 's/^\s*"version": "(.*?)",$/\1/p' package.json);

echo "Deploy with version $VERSION";
docker build -f docker/Dockerfile -t neubiaswg5/web-ui:v$VERSION .;
docker push neubiaswg5/web-ui:v$VERSION;
echo "Done.";

npm pack;

#git tag "v$VERSION";
#git push;

