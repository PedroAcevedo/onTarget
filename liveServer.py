from livereload import Server
import argparse


def inputParse() -> argparse.Namespace:
    """
    Function to parse line-command arguments

    Returns
    -------
    argsparse.Namespace object with parsed parameters
    """
    description = ('server with live-realoading on css/ and js/ directories.')
    
    p = argparse.ArgumentParser(description=description)
    default_port = 8080
    p.add_argument('-P', '--port', default=default_port,type=int,
	               help=f'default port to serve web page(default = {default_port}).')
    args = p.parse_args()
    return args

def main(port : int, **kwargs) -> None:
    """
    serves index.html using livereload and watches css/ and js/

    Parameters
    ----------
    port: int, default = 8080
    **kwargs: dict, named parameters to pass on serve() function
    """
    server = Server()
    # run a function
    def alert():
        print('reloading server...¡a perro traes el omnitrix!')

    try:
        server.watch('css/', alert)
        server.watch('js/', alert)
        server.serve(port=port, **kwargs)
    except Exception as err:
        print(err)

if __name__ == "__main__":
    args = inputParse()
    main(**vars(args))