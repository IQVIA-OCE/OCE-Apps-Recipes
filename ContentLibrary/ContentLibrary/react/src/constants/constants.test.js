import { OWNED_BY_ME, SHARED_WITH_ME } from './constants';

test('Constants', () => {
    expect(OWNED_BY_ME).toEqual('ownedByMe');
    expect(SHARED_WITH_ME).toEqual('sharedWithMe');
});