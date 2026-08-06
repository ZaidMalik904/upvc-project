const dns = require('dns');

dns.resolveSrv('_mongodb._tcp.upvc-project.7ixtc5d.mongodb.net', (err, addresses) => {
  if (err) {
    console.error('SRV Resolution failed:', err);
    process.exit(1);
  }
  
  console.log('SRV Addresses:', addresses);
  const hostnames = addresses.map(a => `${a.name}:${a.port}`).join(',');
  const txtDomain = 'upvc-project.7ixtc5d.mongodb.net';
  
  dns.resolveTxt(txtDomain, (errTxt, txtRecords) => {
    let authSource = 'admin';
    let replicaSet = 'atlas-xxxx-shard-0'; // guess
    
    if (!errTxt && txtRecords) {
        console.log('TXT Records:', txtRecords);
        // TXT usually contains authSource and replicaSet info
    }
    
    const uri = `mongodb://upvc-project:wObkqoLl2tugdVHl@${hostnames}/upvc_database?ssl=true&authSource=admin&replicaSet=atlas-11k7x6-shard-0`;
    console.log('\nFallback URI:\n', uri);
  });
});
