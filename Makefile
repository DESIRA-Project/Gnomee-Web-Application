prod:
	ng build --outputHashing=all --prod --aot --base-href /kbt/ --deploy-url /kbt/ --configuration production
	tar -cvf dist.tar.gz dist
dev:
	ng build --outputHashing=all --prod --aot --base-href /kbt/ --deploy-url /kbt/ --configuration remove-dev
	tar -cvf dist.tar.gz dist
run:
	ng serve --open --configuration local
build:
	ng build --outputHashing=all --prod --aot --base-href /kbt/ --deploy-url /kbt/ --configuration production
instr:
	ng build  --outputHashing=all --prod --aot --base-href /kbt/ --deploy-url /kbt/ --configuration production --stats-json
send:
	scp dist.tar.gz mdorgiakis@esperos.di.uoa.gr:~
opt:
	ng build  --outputHashing=all --prod --aot --base-href /kbt/ --deploy-url /kbt/ --configuration remove-dev --build-optimizer
