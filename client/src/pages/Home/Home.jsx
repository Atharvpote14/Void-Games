import HeroSection from '@/pages/Home/sections/HeroSection'
import GameSection from '@/pages/Home/sections/GameSection'
import CollectionsSection from '@/pages/Home/sections/CollectionsSection'
import CategoriesSection from '@/pages/Home/sections/CategoriesSection'
import LatestFixesSection from '@/pages/Home/sections/LatestFixesSection'
import LatestGuidesSection from '@/pages/Home/sections/LatestGuidesSection'
import CommunitySection from '@/pages/Home/sections/CommunitySection'
import usePageMeta from '@/hooks/usePageMeta'
import {
  getFeaturedGames,
  getTrendingGames,
  getLatestGames,
  getPopularGames,
} from '@/services/games'

function Home() {
  usePageMeta({ path: '/' })

  return (
    <>
      <HeroSection />
      <GameSection
        title="Featured Games"
        subtitle="Handpicked titles curated by the Void Games team."
        fetcher={getFeaturedGames}
        viewAllLink="/games?sort=featured"
        layout="grid"
        limit={8}
      />
      <GameSection
        title="Trending Now"
        subtitle="The most talked about games this week."
        fetcher={getTrendingGames}
        viewAllLink="/games?sort=trending"
        layout="row"
        limit={10}
      />
      <GameSection
        title="Recently Added"
        subtitle="Fresh additions to the library."
        fetcher={getLatestGames}
        viewAllLink="/games?sort=latest"
        layout="row"
        limit={10}
      />
      <CollectionsSection />
      <CategoriesSection />
      <LatestFixesSection />
      <LatestGuidesSection />
      <GameSection
        title="Most Downloaded"
        subtitle="The games everyone is installing."
        fetcher={getPopularGames}
        viewAllLink="/games?sort=popular"
        layout="row"
        limit={10}
      />
      <CommunitySection />
    </>
  )
}

export default Home
