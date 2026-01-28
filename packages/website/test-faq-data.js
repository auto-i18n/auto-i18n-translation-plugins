import faqData from './src/data/faqData.js'

console.log('=== FAQ Data Structure ===')
console.log('Keys:', Object.keys(faqData))
console.log('faqCategories:', faqData.faqCategories?.length)
console.log('faqData:', faqData.faqData?.length)
console.log('questions:', faqData.questions?.length)

if (faqData.faqData && faqData.faqData.length > 0) {
  console.log('\nFirst question structure:', Object.keys(faqData.faqData[0]))
}
