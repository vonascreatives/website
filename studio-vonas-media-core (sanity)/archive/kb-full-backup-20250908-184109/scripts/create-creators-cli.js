// 10 Exclusive Creator Profiles to Create Manually in Sanity Studio
// Access: http://localhost:3333/ → Team → Exclusive Creators → Create New

const exclusiveCreators = [
  {
    name: "Alexandra Chen",
    niche: "Tech Reviews & Tutorials", 
    subscribers: "2.8M",
    bio: "Leading tech reviewer specializing in smartphone reviews, gadget tutorials, and emerging technology analysis. Known for detailed technical breakdowns and honest product assessments.",
    joinDate: "2023-03-15",
    socialLinks: {
      youtube: "https://youtube.com/@alexandrachen",
      instagram: "https://instagram.com/alexandrachen", 
      twitter: "https://twitter.com/alexandrachen"
    }
  },
  {
    name: "Marcus Johnson", 
    niche: "Gaming & Esports",
    subscribers: "3.5M",
    bio: "Professional gamer and esports analyst covering competitive gaming, game reviews, and industry insights. Former pro player with expertise in FPS and strategy games.",
    joinDate: "2023-02-20",
    socialLinks: {
      youtube: "https://youtube.com/@marcusjohnson",
      instagram: "https://instagram.com/marcusjohnson",
      twitter: "https://twitter.com/marcusjohnson"
    }
  },
  {
    name: "Sofia Rodriguez",
    niche: "Lifestyle & Fashion",
    subscribers: "2.1M", 
    bio: "Fashion influencer and lifestyle content creator sharing style tips, beauty tutorials, and wellness advice. Focus on sustainable fashion and authentic lifestyle content.",
    joinDate: "2023-04-10",
    socialLinks: {
      youtube: "https://youtube.com/@sofiarodriguez",
      instagram: "https://instagram.com/sofiarodriguez",
      twitter: "https://twitter.com/sofiarodriguez"
    }
  },
  {
    name: "David Park",
    niche: "Food & Cooking",
    subscribers: "1.9M",
    bio: "Chef and culinary educator creating recipe tutorials, cooking techniques, and restaurant reviews. Specializes in fusion cuisine and accessible cooking for home chefs.",
    joinDate: "2023-01-25",
    socialLinks: {
      youtube: "https://youtube.com/@davidpark",
      instagram: "https://instagram.com/davidpark",
      twitter: "https://twitter.com/davidpark"
    }
  },
  {
    name: "Emma Thompson",
    niche: "Travel & Adventure",
    subscribers: "2.3M",
    bio: "Adventure travel vlogger documenting global destinations, cultural experiences, and outdoor activities. Promotes sustainable travel and cultural awareness.",
    joinDate: "2023-05-05",
    socialLinks: {
      youtube: "https://youtube.com/@emmathompson",
      instagram: "https://instagram.com/emmathompson",
      twitter: "https://twitter.com/emmathompson"
    }
  },
  {
    name: "Ryan Mitchell", 
    niche: "Fitness & Health",
    subscribers: "1.7M",
    bio: "Certified personal trainer and nutritionist sharing workout routines, health tips, and wellness advice. Focus on sustainable fitness and mental health awareness.",
    joinDate: "2023-03-30",
    socialLinks: {
      youtube: "https://youtube.com/@ryanmitchell",
      instagram: "https://instagram.com/ryanmitchell",
      twitter: "https://twitter.com/ryanmitchell"
    }
  },
  {
    name: "Isabella Martinez",
    niche: "Art & Design",
    subscribers: "1.4M",
    bio: "Digital artist and design educator creating tutorials on illustration, graphic design, and creative workflows. Specializes in Adobe Creative Suite and digital art techniques.",
    joinDate: "2023-06-12",
    socialLinks: {
      youtube: "https://youtube.com/@isabellamartinez",
      instagram: "https://instagram.com/isabellamartinez", 
      twitter: "https://twitter.com/isabellamartinez"
    }
  },
  {
    name: "James Wilson",
    niche: "Music & Entertainment", 
    subscribers: "2.6M",
    bio: "Music producer and entertainment journalist covering music industry news, artist interviews, and production tutorials. Expert in electronic music and audio engineering.",
    joinDate: "2023-02-08",
    socialLinks: {
      youtube: "https://youtube.com/@jameswilson",
      instagram: "https://instagram.com/jameswilson",
      twitter: "https://twitter.com/jameswilson"
    }
  },
  {
    name: "Chloe Kim",
    niche: "Education & Learning",
    subscribers: "1.8M", 
    bio: "Educational content creator and former teacher developing study guides, academic tutorials, and learning strategies. Focus on STEM education and student success.",
    joinDate: "2023-04-22",
    socialLinks: {
      youtube: "https://youtube.com/@chloekim",
      instagram: "https://instagram.com/chloekim",
      twitter: "https://twitter.com/chloekim"
    }
  },
  {
    name: "Michael Brown",
    niche: "Business & Finance",
    subscribers: "2.2M",
    bio: "Financial advisor and business strategist sharing investment advice, market analysis, and entrepreneurship insights. Expertise in personal finance and startup guidance.",
    joinDate: "2023-01-18",
    socialLinks: {
      youtube: "https://youtube.com/@michaelbrown",
      instagram: "https://instagram.com/michaelbrown",
      twitter: "https://twitter.com/michaelbrown"
    }
  }
]

console.log('🌟 10 EXCLUSIVE CREATORS TO CREATE')
console.log('==================================')
console.log('')
console.log('📝 INSTRUCTIONS:')
console.log('1. Go to http://localhost:3333/')
console.log('2. Navigate to Team → Exclusive Creators')
console.log('3. Click "Create New Exclusive Creator"')
console.log('4. Use the data below for each creator')
console.log('5. Add stock profile images (400x400) and banner images (1200x300)')
console.log('6. Include proper alt text for all images')
console.log('')

exclusiveCreators.forEach((creator, index) => {
  console.log(`${index + 1}. ${creator.name}`)
  console.log(`   Niche: ${creator.niche}`)
  console.log(`   Subscribers: ${creator.subscribers}`)
  console.log(`   Join Date: ${creator.joinDate}`)
  console.log(`   Bio: ${creator.bio}`)
  console.log(`   YouTube: ${creator.socialLinks.youtube}`)
  console.log(`   Instagram: ${creator.socialLinks.instagram}`)
  console.log(`   Twitter: ${creator.socialLinks.twitter}`)
  console.log(`   Profile Image Alt: "Professional profile photo of ${creator.name}, exclusive creator specializing in ${creator.niche}"`)
  console.log(`   Banner Image Alt: "Content banner for ${creator.name}'s ${creator.niche} channel"`)
  console.log('')
})

console.log('✅ REMEMBER:')
console.log('- Set "Exclusive Content" to TRUE for all creators')
console.log('- Add profile photos (400x400 pixels)')  
console.log('- Add banner images (1200x300 pixels)')
console.log('- Include descriptive alt text for accessibility')
console.log('- Publish each document after creation')
console.log('')
console.log('🎨 SUGGESTED TOOLS FOR IMAGES:')
console.log('- UI Avatars: https://ui-avatars.com/')
console.log('- Avatar.io: https://avatar.io')
console.log('- Canva: https://canva.com (for banners)')
console.log('- Figma: https://figma.com (for custom designs)')

module.exports = { exclusiveCreators }
