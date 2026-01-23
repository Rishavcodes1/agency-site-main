
import FAQs from "./faqs/FAQs"
import Hero from "./hero/Hero"
import OurServices from "./services/OurServices"
import WhyChooseus from "./why-choose-us/WhyChooseUs"
import FirstClient from "@/components/shared/FirstClient"
import ForSeo from "@/components/shared/ForSeo"


const Home = () => {

    return (
        <>
            <ForSeo
                title="Acurve - Software & Marketing Solutions for Business Growth"
                description="Accelerate your business with Acurve's cutting-edge software and data-driven marketing."
                path=""
            />
            
            <div>
                <Hero />
                <OurServices />

                <WhyChooseus />

                <FAQs />
                <FirstClient />
            </div>
        </>
    )
}

export default Home
