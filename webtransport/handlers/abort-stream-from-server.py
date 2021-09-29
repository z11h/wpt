from typing import Optional, Tuple
from urllib.parse import urlsplit, parse_qsl
import logging


_logger: logging.Logger = logging.getLogger(__name__)

def session_established(session):
    _logger.info('session_established')
    path: Optional[bytes] = None
    for key, value in session.request_headers:
        if key == b':path':
            path = value
    assert path is not None
    qs = dict(parse_qsl(urlsplit(path).query))
    code = qs[b'code']
    if code is None:
        raise Exception('code is missing, path = {}'.format(path))
    session.dict_for_handlers['code'] = int(code)


def stream_data_received(session,
                         stream_id: int,
                         data: bytes,
                         stream_ended: bool):
    code: int = session.dict_for_handlers['code']
    if session.stream_is_unidirectional(stream_id):
        _logger.info('stop_stream({}, {})'.format(stream_id, code))
        session.stop_stream(stream_id, code)
    else:
        _logger.info('stop_stream({}, {})'.format(stream_id, code))
        _logger.info('reset_stream({}, {})'.format(stream_id, code))
        session.stop_stream(stream_id, code)
        session.reset_stream(stream_id, code)