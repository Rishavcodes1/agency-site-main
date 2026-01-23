import ForSeo from '@/components/shared/ForSeo'
import ContactPage from './ContactForm'

const Contact = () => {

    return (
        <>
            <ForSeo
                title="Contact Acurve - Get in Touch with Our Team"
                description="Reach out to Acurve for software solutions, marketing strategy, or any inquiries. We're here to help your business grow."
                path="/contact"
            />
            <ContactPage />
        </>
    )
}

export default Contact
