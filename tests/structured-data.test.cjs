const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')

function homepageSchema() {
  const html = fs.readFileSync('index.html', 'utf8')
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
  assert.ok(match, 'homepage JSON-LD is present')
  return JSON.parse(match[1])
}

test('store languages belong to a ContactPoint', () => {
  const schema = homepageSchema()
  assert.equal(schema['@type'], 'MobilePhoneStore')
  assert.equal(schema.availableLanguage, undefined)
  assert.equal(schema.contactPoint['@type'], 'ContactPoint')
  assert.deepEqual(schema.contactPoint.availableLanguage, ['en', 'es', 'ar'])
})

test('local store identity and hours remain complete', () => {
  const schema = homepageSchema()
  assert.equal(schema['@id'], 'https://megawirelessusa.com/#store')
  assert.equal(schema.address.addressCountry, 'US')
  assert.equal(schema.openingHoursSpecification[0].opens, '10:00')
  assert.equal(schema.openingHoursSpecification[0].closes, '20:00')
})
