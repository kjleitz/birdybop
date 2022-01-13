# birdybop crawler



## solr notes

### resources

- https://github.com/docker-solr/docker-solr
- https://solr.apache.org/guide/8_11/solr-tutorial.html
- https://examples.javacodegeeks.com/apache-solr-on-docker-example/ was a bit useful as well

### journal

to set up solr & run it as an individual instance, I had to:

```bash
sudo chown 8983:8983 solr_data/
docker run -v "$PWD/solr_data:/var/solr" -p 8983:8983 --name birdybop_solr solr:latest solr-precreate birdybop_core
```

to set up solr & run it as a cluster, I had to:

```bash
touch docker-compose.yml # and add the contents
docker-compose up # in a different terminal window, because I wanna see the output rather than run it in daemon mode
docker exec solr1 solr create -c source_pages # creates a collection (core? no)
```

### questions

- do I create generic cores (`birdybop_core_1`, `birdybop_core_2`, `birdybop_core_3`...) that all have the same data in a cluster, or do I create one per domain (`books`, `authors`, `publishers`...)? esp. if I plan on running multiple instances
- difference between collections and cores?
