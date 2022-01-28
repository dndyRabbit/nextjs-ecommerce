import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
	render() {
		return (
			<Html lang="end">
				<Head>
					<meta
						name="description"
						content="Rabbit Studios first Website with Next.Js"
					/>
					<link
						rel="stylesheet"
						href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"
					/>
					<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" />
					<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.bundle.min.js" />

					<script src="https://kit.fontawesome.com/a076d05399.js"></script>
					<script
						src={`https://www.paypal.com/sdk/js?client-id=${process.env.PAYPAL_CLIENT_ID}`}
					>
						{" "}
					</script>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
