const ContactPage = () => {
  return <div className="container max-w-4xl mx-auto px-0">
      <h1 className="font-bold mb-8 text-2xl">Contactez-nous</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="font-semibold text-base">Nos Coordonnées</h2>
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <span className="font-medium">Téléphone 1:</span>
              <a href="tel:+243851006476" className="text-primary hover:underline">+243 851 006 476</a>
            </p>
            <p className="flex items-center gap-2">
              <span className="font-medium">Téléphone 2:</span>
              <a href="tel:+243996886079" className="text-primary hover:underline">+243 996 886 079</a>
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Horaires</h2>
          <p>Notre équipe est disponible du lundi au vendredi, de 9h à 18h.</p>
        </div>
      </div>
    </div>;
};
export default ContactPage;